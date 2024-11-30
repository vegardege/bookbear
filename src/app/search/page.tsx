import Container from "@/components/Container";
import Title from "@/components/Title";
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
  return search(decodeURIComponent(query), 10, 0);
}

/**
 * The search page component.
 *
 * This component is responsible for rendering the search results based on the
 * query parameter passed to it. It uses a slightly customize Fuse.js search
 * to find the closest matching names, using view count when two results are
 * reasonably close.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <section aria-label="Search" className="w-full">
      <Title>Search Results</Title>
      <Container>
        <ul className="min-w-full divide-y divide-divider divide-solid mt-4">
          {searchResults(params.q).map((result) => (
            <li key={result.slug}>
              <a
                key={result.slug}
                href={`/author/${result.slug}`}
                className={`flex flex-row items-center p-3 hover:bg-highlight hover:cursor-pointer`}
              >
                {result.name}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
