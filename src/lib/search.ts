import Fuse, { FuseResult } from "fuse.js";
import { getDatabase } from "@/lib/database";

interface Searchable {
  name: string;
  description: string;
  slug: string;
  views: number;
}

export interface SearchResult extends Searchable {
  score: number;
}

let fuse: Fuse<Searchable> | undefined = undefined;

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
  offset: number
): SearchResult[] {
  if (!fuse) {
    fuse = indexSearch();
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
    description: author.description,
    slug: author.slug,
    views: author.views,
  }));

  return new Fuse(searchResults, {
    keys: ["name"],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.2,
  });
}

/**
 * Sort the search results based on the following rules:
 *
 * 1. Prefer perfect prefixes.
 * 2. If the scores are very similar, sort by views descending.
 * 3. Otherwise, sort by Fuse's ranking, based on edit distance.
 */
function sortResults(
  query: string
): (a: FuseResult<Searchable>, b: FuseResult<Searchable>) => number {
  query = query.toLowerCase().trim();
  return function (a: FuseResult<Searchable>, b: FuseResult<Searchable>) {
    // First, we sort out the possible undefined scores
    if (a.score === undefined || b.score === undefined) {
      return 0;
    }
    if (a.score === undefined) {
      return -1;
    }
    if (b.score === undefined) {
      return 1;
    }

    // Prefer perfect prefixes
    const aName = a.item.name.toLowerCase();
    const bName = b.item.name.toLowerCase();
    if (aName.startsWith(query) && !bName.startsWith(query)) {
      return -1;
    }
    if (!aName.startsWith(query) && bName.startsWith(query)) {
      return 1;
    }

    // Otherwise we score by Fuse's ranking
    return a.score - b.score;
  };
}
