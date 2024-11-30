import { Work } from "@/lib/database";
import BookRow from "./WorkRow";

export default function WorksTable({
  works,
  maxViews,
}: {
  works: Work[];
  maxViews: number;
}) {
  return (
    <table className="min-w-full">
      <tbody className="divide-y divide-divider divide-solid">
        {works.map((work) => (
          <BookRow key={work.qcode} work={work} maxViews={maxViews} />
        ))}
      </tbody>
    </table>
  );
}
