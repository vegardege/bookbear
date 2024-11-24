import BookTable from "@/components/BookTable";
import { getDatabase, Work } from "@/lib/dataStore";

/**
 * Group works by their form of creative work and sort them by the number
 * of works in each group.
 */
function groupAndSortWorks(works: Work[]): Map<string, Work[]> {
  const groups = new Map<string, Work[]>();

  for (const work of works) {
    const key = work.formOfCreativeWork || "Other";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(work);
  }

  // Sort entries by number of views in group
  const sorted = [...groups.entries()].sort((a, b) => {
    const aViews = a[1].reduce((sum, work) => sum + (work.views || 0), 0);
    const bViews = b[1].reduce((sum, work) => sum + (work.views || 0), 0);

    return bViews - aViews;
  });
  return new Map(sorted);
}

function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Author page component.
 *
 * This page contains information about the author and their works.
 */
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const database = getDatabase();
  const author = database.get(id);
  if (!author) {
    return <div>Author not found</div>;
  }

  const workGroups = groupAndSortWorks(author.works);

  return (
    <section aria-label="Author" className="w-full">
      <h1>{author.name}</h1>
      <p>{author.description}</p>
      <h2>Notable Work</h2>
      <BookTable works={author.works.filter((work) => work.notable)} />
      {[...workGroups.entries()].map(([name, works]) => {
        return (
          <div key={name}>
            <h2>{capitalizeWords(name)}</h2>
            <BookTable works={works} />
          </div>
        );
      })}
    </section>
  );
}
