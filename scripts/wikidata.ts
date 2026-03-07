const WIKIDATA_DEFAULT_RETRY_AFTER = 60; // seconds
const WIKIDATA_API_URL = "https://query.wikidata.org/sparql";
const WIKIDATA_API_HEADERS = {
	"Content-Type": "application/sparql-query",
	Accept: "text/csv",
	"User-Agent": "Bookbear/1.0",
};

/**
 * Error thrown for transient API failures (429, 5xx) that should be retried
 * after waiting the specified number of seconds.
 */
class RetryableError extends Error {
	retryAfter: number;

	constructor(message: string, retryAfter: number) {
		super(message);
		this.name = "RetryableError";
		this.retryAfter = retryAfter;

		// Required for instanceof to work correctly in transpiled JS
		Object.setPrototypeOf(this, RetryableError.prototype);
	}
}

/**
 * Executes a SPARQL query against the Wikidata API and returns the result
 * as a CSV formatted string. Note that the return format includes a header
 * row with the column names.
 */
export async function executeSparqlQuery(query: string): Promise<string> {
	const res = await fetch(WIKIDATA_API_URL, {
		method: "POST",
		headers: WIKIDATA_API_HEADERS,
		body: query,
	});
	if (res.status === 429) {
		const retryAfter = parseInt(
			res.headers.get("retry-after") ?? String(WIKIDATA_DEFAULT_RETRY_AFTER),
			10,
		);
		throw new RetryableError(`Too many requests (429)`, retryAfter);
	}
	if (res.status >= 500) {
		throw new RetryableError(
			`Server error: ${res.status} ${res.statusText}`,
			WIKIDATA_DEFAULT_RETRY_AFTER,
		);
	}
	if (!res.ok) {
		throw new Error(`Error executing SPARQL query: ${res.statusText}`);
	}
	return res.text();
}

/**
 * Handles errors from the Wikidata API.
 *
 * If the error is a RetryableError, it returns the number of seconds to
 * wait. Otherwise, it re-throws the error.
 */
export async function handleWikidataError(error: unknown): Promise<number> {
	if (error instanceof RetryableError) {
		return error.retryAfter * 1.5; // Wait a bit longer than requested
	}
	throw error;
}
