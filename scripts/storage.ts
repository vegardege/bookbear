import { mkdir, readdir, readFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { parse } from "csv-parse/sync";
import { getCurrentTimestamp } from "./time";

/**
 * Request a path for a new CSV file in a given group.
 */
export async function getNewPath(
	group: string,
	extension: string = "csv",
): Promise<string> {
	const dir = await getDataDir();
	const fn = `${group}-${getCurrentTimestamp()}.${extension}`;

	return path.join(dir, fn);
}

/**
 * Get all unique author Q codes from the most recent authorships CSV file.
 */
export async function getLatestAuthors(): Promise<string[]> {
	const csvPath = await getMostRecentFilename("authorships");
	const lines = await readCSV(csvPath);
	return [...new Set(lines.map((row) => row[0]))].sort();
}

/**
 * Get all unique work Q codes from the most recent authorships CSV file.
 */
export async function getLatestWorks(): Promise<string[]> {
	const csvPath = await getMostRecentFilename("authorships");
	const lines = await readCSV(csvPath);
	return [...new Set(lines.map((row) => row[1]))].sort();
}

/**
 * Parse a CSV file and return the rows as an array of tuples.
 */
export async function readCSV(csvPath: string | null): Promise<string[][]> {
	if (!csvPath) {
		return [];
	}

	const content = await readFile(path.join(await getDataDir(), csvPath), {
		encoding: "utf-8",
	});

	return parse(content, {
		columns: false,
		trim: true,
		skip_empty_lines: true,
		skip_records_with_error: true,
	});
}

/**
 * Get the path to the latest CSV file in a given group.
 */
export async function getMostRecentFilename(
	group: string,
): Promise<string | null> {
	const dirEntries = await readdir(await getDataDir(), { withFileTypes: true });
	const csvFiles = dirEntries
		.filter((entry) => entry.isFile())
		.filter((entry) => entry.name.startsWith(`${group}-`));

	if (csvFiles.length === 0) {
		return null;
	}
	return csvFiles.sort().at(-1)?.name ?? null;
}

/**
 * Get the user's configured XDG data dir or default.
 * Creates the directory if it does not exist.
 */
async function getDataDir(): Promise<string> {
	const userXdgDataDir = process.env.XDG_DATA_HOME;
	const xdgDataDir =
		userXdgDataDir && userXdgDataDir.trim() !== ""
			? userXdgDataDir
			: path.join(os.homedir(), ".local", "share");

	const bookbearDir = path.join(xdgDataDir, "bookbear");
	await mkdir(bookbearDir, { recursive: true });

	return bookbearDir;
}
