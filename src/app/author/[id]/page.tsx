import { getDatabase, Work } from '@/lib/dataStore';

/**
 * Convenience function to sort works by publication date.
 * If the publication date is not available, it will be sorted to the end.
 */
function sortByDate(a: Work, b: Work): number {
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

  return (
    <div>
      <h1>{author.name}</h1>
      <p>{author.description}</p>
      <h2>Notable Work</h2>
      <ul>
        {author.works.sort(sortByDate).filter(work => work.notable).map((work) => (
          <li key={work.qcode}>
            ({work.publicationDate?.toString()})
            <a href={`https://en.wikipedia.org/wiki/${work.slug}`}>{work.title}</a>
            <a href={`https://www.wikidata.org/wiki/${work.qcode}`}>Wikidata</a>
            ({work.views})
          </li>
        ))}
      </ul>
      <h2>Works</h2>
      <ul>
        {author.works.sort(sortByDate).map((work) => (
          <li key={work.qcode}>
            {work.qcode}
            ({work.publicationDate?.toString()})
            <a href={`https://en.wikipedia.org/wiki/${work.slug}`}>{work.title}</a>
            <a href={`https://www.wikidata.org/wiki/${work.qcode}`}>Wikidata</a>
            ({work.views})
          </li>
        ))}
      </ul>
    </div>
  );
}
