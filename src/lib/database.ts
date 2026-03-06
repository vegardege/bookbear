import fs from "node:fs";
import path from "node:path";

export type Author = {
	qcode: string;
	name: string;
	description: string;
	slug: string;
	views: number;
	works: Work[];
};

export type Work = {
	qcode: string;
	title: string;
	slug?: string;
	publicationYear?: number;
	views?: number;
	notable: boolean;
	formOfCreativeWork?: string;
	formOfCreativeWorkQcode?: string;
};

const DB_PATH = path.join(process.cwd(), "data", "database.json");
const database = new Map<string, Author>();

/**
 * Get the cached database of authors and works.
 */
export function getDatabase(): Map<string, Author> {
	if (database.size === 0) {
		loadDatabase();
		watchDatabase();
	}
	return database;
}

/**
 * Fill the in-memory database from a JSON file.
 *
 * For the time being, this database is too small to justify setting up
 * an actual backend db. We just load it in memory and keep it there.
 */
function loadDatabase() {
	if (!fs.existsSync(DB_PATH)) {
		throw new Error("Database file not found");
	}
	const data = fs.readFileSync(DB_PATH, { encoding: "utf-8" });
	let authors: Author[];
	try {
		authors = JSON.parse(data) as Author[];
	} catch {
		throw new Error("Database file is corrupted or contains invalid JSON");
	}
	if (authors.length === 0) {
		throw new Error("Database file is empty");
	}
	database.clear();
	for (const author of authors) {
		database.set(author.slug, author);
	}
	sortWorks();
}

/**
 * Watch the database file for changes and reload in-memory data when it's updated.
 */
function watchDatabase() {
	fs.watchFile(DB_PATH, { interval: 5000 }, () => {
		try {
			loadDatabase();
		} catch (err) {
			console.error("Failed to reload database, keeping stale data:", err);
		}
	});
}

/**
 * We want to sort works by publication date, with works missing a date
 * at the end of the list.
 */
function compareWorks(a: Work, b: Work): number {
	if (a.publicationYear != null && b.publicationYear != null) {
		return a.publicationYear - b.publicationYear;
	}
	if (a.publicationYear != null) {
		return -1;
	}
	if (b.publicationYear != null) {
		return 1;
	}
	return 0;
}

/**
 * Sort the works of each author by publication date in-place.
 */
function sortWorks() {
	for (const author of database.values()) {
		author.works.sort(compareWorks);
	}
}
