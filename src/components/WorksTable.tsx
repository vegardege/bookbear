import { Work } from "@/lib/dataStore";
import BookRow from "./WorkRow";

export default function WorksTable({
  works,
  maxViews,
}: {
  works: Work[];
  maxViews: number;
}) {
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
    <table className="min-w-full">
      <tbody className="divide-y divide-[#efba6f] divide-solid">
        {works.map((work) => (
          <BookRow work={work} maxViews={maxViews} />
        ))}
      </tbody>
    </table>
  );
}
