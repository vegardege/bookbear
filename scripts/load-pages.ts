/**
 * Loads CSV data from Wikidata using the limit-offset pagination method.
 */
import { executeSparqlQuery, handleWikidataError } from "./wikidata.js";
import { sleep } from "./utils.js";
import { createWriteStream } from "fs";

/**
 * Loads a single set of pages from Wikidata.
 */
async function loadPages(
  query: string,
  limit: number,
  offset: number
): Promise<string> {
  let data = await executeSparqlQuery(
    `${query}
    LIMIT ${limit}
    OFFSET ${offset}`
  );

  // Skip the header line and remove the repeated base URL,
  // keeping only a list of comma separated Q codes.
  return data
    .substring(data.indexOf("\n") + 1)
    .replaceAll("http://www.wikidata.org/entity/", "")
    .trim();
}

/**
 * Generates all CSV rows from Wikidata.
 *
 * This is an infrequently run batch operation, so we are a bit kinder than
 * the documentation requires. Shouldn't take too long to run anyway.
 */
async function* loadAllPages(
  query: string,
  limit: number
): AsyncGenerator<string, void, void> {
  console.log("Loading from Wikidata");

  let offset = 0;

  while (true) {
    try {
      console.log(`- Loading rows ${offset}-${offset + limit}`);
      const data = await loadPages(query, limit, offset);
      if (data.length === 0) {
        break; // No more data
      }
      yield data;
      offset += limit;

      await sleep(1);
    } catch (error) {
      const retryAfter = await handleWikidataError(error);
      console.log(`- Too many requests, waiting for ${retryAfter} seconds`);
      await sleep(retryAfter);
    }
  }
}

/**
 * Creates a CSV file with the results of a SPARQL query from Wikidata.
 *
 * The function uses pagination with limit and offset to split a big
 * query in smaller parts.
 *
 * Note that the function will stream data to a file. If it fails in the
 * middle of the process, the file will be incomplete. The caller is
 * responsible for handling this case.
 *
 * @param filename - The name of the output file.
 * @param query - The SPARQL query to execute.
 * @param limit - The number of rows to load in each request.
 *
 * @returns A promise that resolves when the file is created.
 *
 * @throws {Error} If the query fails or the file cannot be created.
 */
export async function loadPagesToCSV(
  filename: string,
  query: string,
  limit: number
): Promise<void> {
  console.log("Creating output file");
  const stream = createWriteStream(filename, { encoding: "utf-8" });

  stream.write("author,work\n");
  for await (const chunk of loadAllPages(query, limit)) {
    stream.write(chunk + "\r\n");
  }
  stream.end();
  console.log(`Created file ${filename}`);
}
