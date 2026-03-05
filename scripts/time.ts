/**
 * Extract the publication year from a Wikidata date string such as
 * "+1984-01-01T00:00:00Z" or "-0399-01-01T00:00:00Z".
 * Returns undefined if the input is empty or unparseable.
 */
export function parseWikidataYear(
	dateStr: string | undefined,
): number | undefined {
	if (!dateStr) return undefined;
	const datePart = dateStr.split("T")[0]; // "+1984-01-01" or "-0399-01-01"
	const yearStr = datePart.slice(0, -6); // "+1984" or "-0399"
	const year = parseInt(yearStr, 10);
	return Number.isNaN(year) ? undefined : year;
}

/**
 * Pauses execution for the specified number of seconds.
 */
export async function sleep(seconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Get the current timestamp in the format YYYYMMDD-HHMMSS.
 */
export function getCurrentTimestamp(): string {
	const date = new Date();

	const pad = (n: number) => n.toString().padStart(2, "0");

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // getMonth() is 0-based
	const day = pad(date.getDate());

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}
