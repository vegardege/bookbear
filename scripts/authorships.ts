/**
 * Defined the relationship between authors and their works.
 *
 * This script only gets the Q codes of the authors and works, the rest must be
 * hydrated using separate scripts.
 */
import { executeSparqlQuery, handleWikidataError } from "./wikidata.js";
import { sleep } from "./utils.js";
import { createWriteStream } from "fs";

/**
 * Loads a single chunk of author-work pairs from Wikidata.
 */
async function loadAuthorship(limit: number, offset: number): Promise<string> {
  let data = await executeSparqlQuery(`
          SELECT ?author ?work
          WHERE {
              ?work   wdt:P31 wd:Q7725634 ; # Instance of 'literary work'
                      wdt:P50 ?author .     # which has a registered author
              ?author wdt:P31 wd:Q5 .       # who is a human being
          }
          LIMIT ${limit}
          OFFSET ${offset}
      `);

  // Skip the header line and remove the repeated base URL,
  // keeping only a list of comma separated Q codes.
  return data
    .substring(data.indexOf("\n") + 1)
    .replaceAll("http://www.wikidata.org/entity/", "")
    .trim();
}

/**
 * Loads all authorships from Wikidata in chunks.
 *
 * This is an infrequently run batch operation, so we are a bit kinder than
 * the documentation requires. Shouldn't take too long to run anyway.
 */
async function* loadAllAuthorships(): AsyncGenerator<string, void, void> {
  console.log("Loading all authorships from Wikidata");

  const limit = 10_000;
  let offset = 0;

  while (true) {
    try {
      console.log(`- Loading rows ${offset}-${offset + limit}`);
      const data = await loadAuthorship(limit, offset);
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
 * Creates a CSV file with all author-work pairs.
 */
export async function createAuthorWorkFile(filename: string): Promise<void> {
  console.log("Creating authorships file");
  const stream = createWriteStream(filename, { encoding: "utf-8" });

  stream.write("author,work\n");
  for await (const chunk of loadAllAuthorships()) {
    stream.write(chunk + "\n");
  }
  stream.end();
  console.log(`Created file ${filename}`);
}
