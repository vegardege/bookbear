import { search, SearchResult } from "@/lib/search";

/**
 * Execute a search query based on input type and return results.
 */
function searchResults(query: string | string[] | undefined): SearchResult[] {
    if (!query) {
        return [];
    }
    if (Array.isArray(query)) {
        query = query[0];
    }
    return search(query, 10, 0);
}

/**
 * The search page component.
 * 
 * This component is responsible for rendering the search results based on the
 * query parameter passed to it. It uses a slightly customize Fuse.js search
 * to find the closest matching names, using view count when two results are
 * reasonably close.
 */
export default async function SearchPage({ searchParams }: {
    searchParams: Promise<{ q: string | string[] | undefined }>;
  }) {
    const params = await searchParams;
    const query = params.q;
    
    return (
        <div>
        <h1>Search Results for {query}</h1>
        <ul>
            {searchResults(query).map((result) => (
                <li key={result.slug}>
                    <a href={`/author/${result.slug}`}>
                        {result.name} ({result.score}) - {result.views}
                    </a>
                </li>
            ))}
        </ul>
        </div>
    );
}