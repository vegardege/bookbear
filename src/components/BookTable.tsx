import { Work } from "@/lib/dataStore";

export default function BookTable({ works }: { works: Work[] }) {
  works = works.sort((a, b) => {
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
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          {works.map((work) => (
            <tr key={work.qcode}>
              <td className="">{work.publicationDate?.substring(0, 4)}</td>
              <td className="">{work.title}</td>
              <td className="">{work.views}</td>
              <td className="">
                <a
                  href={`https://www.wikidata.org/wiki/${work.qcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WD
                </a>
                -
                {work.slug && (
                  <a
                    href={`https://www.wikidata.org/wiki/${work.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WP
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
