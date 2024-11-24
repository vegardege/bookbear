import { Work } from "@/lib/dataStore";
import BookRow from "./BookRow";

export default function BookTable({
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
    <div
      className="overflow-x-auto rounded-lg shadow-md"
      style={{ backgroundColor: "#f5d5a7" }}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          {works.map((work) => (
            <BookRow work={work} maxViews={maxViews} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
