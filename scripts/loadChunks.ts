/**
 * Loads CSV data from Wikidata using the chunk method. Unlike pagination, this
 * assumes we have a list of IDs we want to extract.
 */
import { createWriteStream } from "node:fs";
import { sleep } from "./time.js";
import { executeSparqlQuery, handleWikidataError } from "./wikidata.js";

/**
 * Loads a single set of pages from Wikidata.
 */
async function loadChunk(query: string, ids: string[]): Promise<string> {
	const data = await executeSparqlQuery(
		query.replace("{{chunk}}", ids.map((id) => `wd:${id}`).join(" ")),
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
async function* loadAllChunks(
	query: string,
	ids: string[],
	initialOffset: number,
	chunkSize: number,
): AsyncGenerator<string, void, void> {
	console.log("Loading from Wikidata");

	let offset = initialOffset;

	while (offset < ids.length) {
		try {
			const chunk = ids.slice(offset, offset + chunkSize);
			console.log(`- Loading rows ${offset}-${offset + chunk.length}`);

			const data = await loadChunk(query, chunk);
			console.log(`- Received ${data.split("\r\n").length} rows`);

			yield data;
			offset += chunkSize;

			await sleep(5);
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
 * The function uses chunk loading with a set of ids in each query to
 * split a big query in smaller parts.
 *
 * Note that the function will stream data to a file. If it fails in the
 * middle of the process, the file will be incomplete. The caller is
 * responsible for handling this case.
 *
 * @param filename - The name of the output file.
 * @param query - The SPARQL query to execute.
 * @param ids - The list of IDs to query for.
 * @param chunkSize - The number of IDs to load in each request.
 *
 * @returns A promise that resolves when the file is created.
 *
 * @throws {Error} If the query fails or the file cannot be created.
 */
export async function loadChunksToCSV(
	filename: string,
	query: string,
	ids: string[],
	initialOffset: number,
	chunkSize: number,
): Promise<void> {
	console.log("Creating output file");
	console.log(`Extracting rows ${initialOffset}-${ids.length}`);

	const stream = createWriteStream(filename, { encoding: "utf-8" });
	const chunks = loadAllChunks(query, ids, initialOffset, chunkSize);

	for await (const chunk of chunks) {
		stream.write(`${chunk}\r\n`);
	}
	stream.end();
	console.log(`Created file ${filename}`);
}
