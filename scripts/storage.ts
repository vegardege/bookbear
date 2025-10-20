import { mkdir, readdir, readFile, unlink } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { parse } from "csv-parse/sync";
import { getCurrentTimestamp } from "./time";

const GROUPS = ["authorships", "notables", "authors", "works", "aggregate"];

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
 * Get all files in a given group, sorted by name (which includes timestamp).
 */
async function getAllFilesInGroup(group: string): Promise<string[]> {
	const dirEntries = await readdir(await getDataDir(), { withFileTypes: true });
	return dirEntries
		.filter((entry) => entry.isFile())
		.filter((entry) => entry.name.startsWith(`${group}-`))
		.map((entry) => entry.name)
		.sort();
}

/**
 * Delete all files in a group except the most recent one.
 * Returns the number of files deleted.
 */
async function cleanGroup(group: string): Promise<number> {
	const files = await getAllFilesInGroup(group);

	if (files.length <= 1) {
		return 0;
	}

	// Keep the most recent file (last in sorted array), delete the rest
	const filesToDelete = files.slice(0, -1);
	const dataDir = await getDataDir();

	await Promise.all(
		filesToDelete.map((file) => unlink(path.join(dataDir, file))),
	);

	return filesToDelete.length;
}

/**
 * Clean all data groups by deleting old files, keeping only the most recent
 * file in each group.
 *
 * @returns A map of group names to the number of files deleted in each group.
 */
export async function cleanAllGroups(): Promise<Map<string, number>> {
	const results = new Map<string, number>();

	for (const group of GROUPS) {
		const deletedCount = await cleanGroup(group);
		results.set(group, deletedCount);
	}

	return results;
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
