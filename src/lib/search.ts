import Fuse, { type FuseResult } from "fuse.js";
import { getDatabase, getDatabaseVersion } from "@/lib/database";

interface Searchable {
	name: string;
	normalizedName: string;
	description: string;
	slug: string;
	views: number;
}

export interface SearchResult extends Omit<Searchable, "normalizedName"> {
	score: number;
}

/**
 * The Fuse instance used for searching.
 *
 * This is lazily initialized to avoid indexing on every request, and rebuilt
 * whenever the database is reloaded so new authors become searchable.
 */
let fuse: Fuse<Searchable> | undefined;
let fuseVersion = -1;

/**
 * Search for an author by name.
 *
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param offset - The number of results to skip.
 *
 * @returns An array of search results.
 */
export function search(
	query: string,
	limit: number,
	offset: number,
): SearchResult[] {
	const version = getDatabaseVersion();
	if (!fuse || fuseVersion !== version) {
		fuse = indexSearch();
		fuseVersion = version;
	}
	return fuse
		.search(query)
		.sort(sortResults(query))
		.slice(offset, offset + limit)
		.map((result) => ({
			name: result.item.name,
			description: result.item.description,
			slug: result.item.slug,
			views: result.item.views,
			score: result.score || 0,
		}));
}

/**
 * Create a new Fuse instance for searching.
 */
function indexSearch(): Fuse<Searchable> {
	const db = getDatabase();
	const authors = Array.from(db.values());

	const searchResults = authors.map((author) => ({
		name: author.name,
		normalizedName: normalize(author.name),
		description: author.description,
		slug: author.slug,
		views: author.views,
	}));

	return new Fuse(searchResults, {
		keys: ["name"],
		includeScore: true,
		ignoreLocation: true,
		ignoreDiacritics: true,
		threshold: 0.2,
	});
}

/**
 * Lowercase and strip diacritics, so "Brontë" and "bronte" compare equal.
 */
function normalize(text: string): string {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();
}

/**
 * Sort the search results based on the following rules:
 *
 * 1. Prefer perfect prefixes.
 * 2. If the scores are very similar, sort by views descending.
 * 3. Otherwise, sort by Fuse's ranking, based on edit distance.
 */
function sortResults(
	query: string,
): (a: FuseResult<Searchable>, b: FuseResult<Searchable>) => number {
	query = normalize(query);
	return (a: FuseResult<Searchable>, b: FuseResult<Searchable>) => {
		// First, we sort out the possible undefined scores
		if (a.score === undefined && b.score === undefined) {
			return 0;
		}
		if (a.score === undefined) {
			return -1;
		}
		if (b.score === undefined) {
			return 1;
		}

		// Prefer perfect prefixes
		const aName = a.item.normalizedName;
		const bName = b.item.normalizedName;
		if (aName.startsWith(query) && !bName.startsWith(query)) {
			return -1;
		}
		if (!aName.startsWith(query) && bName.startsWith(query)) {
			return 1;
		}

		// If scores are very similar, prefer more popular authors
		if (Math.abs(a.score - b.score) < 0.05) {
			return b.item.views - a.item.views;
		}

		// Otherwise we score by Fuse's ranking
		return a.score - b.score;
	};
}
