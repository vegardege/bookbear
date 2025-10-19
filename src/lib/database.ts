import fs from "fs";
import path from "path";

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
	publicationDate?: string;
	views?: number;
	notable: boolean;
	formOfCreativeWork?: string;
};

const database = new Map<string, Author>();

/**
 * Get the cached database of authors and works.
 */
export function getDatabase(): Map<string, Author> {
	if (database.size === 0) {
		loadDatabase();
		sortWorks();
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
	const data_path = path.join(process.cwd(), "data", "database.json");
	if (!fs.existsSync(data_path)) {
		throw new Error("Database file not found");
	}
	const data = fs.readFileSync(data_path, { encoding: "utf-8" });
	const authors = JSON.parse(data) as Author[];
	for (const author of authors) {
		database.set(author.slug, author);
	}
}

/**
 * We want to sort works by publication date, with works missing a date
 * at the end of the list.
 */
function compareWorks(a: Work, b: Work): number {
	if (a.publicationDate && b.publicationDate) {
		return a.publicationDate.localeCompare(b.publicationDate);
	}
	if (a.publicationDate) {
		return -1;
	}
	if (b.publicationDate) {
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
