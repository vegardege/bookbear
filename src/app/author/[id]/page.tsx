import BookBox from "@/components/BookBox";
import Container from "@/components/Container";
import { getDatabase, Work } from "@/lib/database";
import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";

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
  const author = database.get(decodeURIComponent(id));
  if (!author) {
    return <div>Author not found</div>;
  }

  const workGroups = [...groupAndSortWorks(author.works).entries()];
  const maxViews = Math.max(...author.works.map((work) => work.views || 0), 1);

  return (
    <section aria-label="Author" className="w-full">
      <Title>{author.name}</Title>
      {workGroups.length > 0 ? (
        workGroups.map(([name, works]) => {
          return (
            <div key={name}>
              <SubTitle>{capitalizeWords(name)}</SubTitle>
              <section aria-label={name} className="mx-1">
                <Container padding={false}>
                  <ul className="min-w-full divide-y divide-divider divide-solid">
                    {works.map((work) => (
                      <BookBox
                        key={work.qcode}
                        work={work}
                        maxViews={maxViews}
                      />
                    ))}
                  </ul>
                </Container>
              </section>
            </div>
          );
        })
      ) : (
        <div className="my-4">
          <Container padding={false}>
            <p className="p-3">No works were found for this author.</p>
          </Container>
        </div>
      )}
    </section>
  );
}
