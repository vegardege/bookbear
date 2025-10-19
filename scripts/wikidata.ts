import axios from "axios";

const WIKIDATA_API_URL = "https://query.wikidata.org/sparql";
const WIKIDATA_API_HEADERS = {
	"Content-Type": "application/sparql-query",
	Accept: "text/csv",
	"User-Agent": "Bookbear/1.0",
};

/**
 * Error thrown when the API returns a 429 Too Many Requests status code.
 * When received, the caller should wait the specified time before retrying.
 */
class TooManyRequestsError extends Error {
	retryAfter: number;

	constructor(retryAfter: number) {
		super(`Too many requests, retry after ${retryAfter} seconds`);
		this.name = "NumericError";
		this.retryAfter = retryAfter;

		// Required for instanceof to work correctly in transpiled JS
		Object.setPrototypeOf(this, TooManyRequestsError.prototype);
	}
}

/**
 * Executes a SPARQL query against the Wikidata API and returns the result
 * as a CSV formatted string. Note that the return format includes a header
 * row with the column names.
 */
export async function executeSparqlQuery(query: string): Promise<string> {
	const res = await axios.post(WIKIDATA_API_URL, query, {
		headers: WIKIDATA_API_HEADERS,
	});
	if (res.status === 429) {
		const retryAfter = parseInt(res.headers["retry-after"], 10);
		throw new TooManyRequestsError(retryAfter);
	}
	if (res.status !== 200) {
		throw new Error(`Error executing SPARQL query: ${res.statusText}`);
	}
	return res.data;
}

/**
 * Handles errors from the Wikidata API.
 *
 * If the error is a TooManyRequestsError, it returns the number of seconds to
 * wait. Otherwise, it re-throws the error.
 */
export async function handleWikidataError(error: unknown): Promise<number> {
	if (error instanceof TooManyRequestsError) {
		return error.retryAfter + 1; // Wait a bit longer than requested
	} else {
		throw error;
	}
}
