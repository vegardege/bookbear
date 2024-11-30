"use client";

import { Work } from "@/lib/database";
import { useState } from "react";
import PopularityBar from "./PopularityBar";
import Star from "./Star";

export default function WorkRow({
  work,
  maxViews,
}: {
  work: Work;
  maxViews: number;
}) {
  const [hover, setHover] = useState(false);

  return (
    <tr
      key={work.qcode}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() => {
        if (work.slug) {
          window.open(`https://www.wikipedia.org/wiki/${work.slug}`, "_blank");
        } else {
          window.open(`https://www.wikidata.org/wiki/${work.qcode}`, "_blank");
        }
      }}
      className={`${hover ? "bg-highlight cursor-pointer" : ""}`}
    >
      <td className="px-2 py-3 w-16">
        <div className="flex flex-row justify-center">
          {work.publicationDate?.substring(0, 4) ?? "–"}
        </div>
      </td>
      <td className="px-1 py-3 pr-4">
        <div className="flex flex-col gap-2 justify-center">
          <span className="m-0 leading-none">{work.title}</span>
          <PopularityBar views={work.views ?? 0} maxViews={maxViews} />
        </div>
      </td>
      <td className="px-2 py-3 w-14">{work.notable && <Star />}</td>
    </tr>
  );
}
