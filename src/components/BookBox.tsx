import Link from "next/link";
import { Work } from "@/lib/database";
import PopularityBar from "./PopularityBar";
import Star from "./Star";

export default function WorkRow({
  work,
  maxViews,
}: {
  work: Work;
  maxViews: number;
}) {
  return (
    <li>
      <a
        key={work.qcode}
        href={
          work.slug
            ? `https://www.wikipedia.org/wiki/${work.slug}`
            : `https://www.wikidata.org/wiki/${work.qcode}`
        }
        className={`flex flex-row items-center py-3 hover:bg-highlight hover:cursor-pointer`}
      >
        <div
          className="flex flex-row w-16 justify-center text-sm"
          title={work.publicationDate}
        >
          <time dateTime={work.publicationDate || ""}>
            {work.publicationDate?.substring(0, 4) || "–"}
          </time>
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-center mx-1">
          <span className="m-0 leading-none">{work.title}</span>
          <PopularityBar views={work.views ?? 0} maxViews={maxViews} />
        </div>
        <div className="w-14">{work.notable && <Star />}</div>
      </a>
    </li>
  );
}
