"use client";

import { Work } from "@/lib/dataStore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BookRow({
  work,
  maxViews,
}: {
  work: Work;
  maxViews: number;
}) {
  let [hover, setHover] = useState(false);

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
      className={`${hover ? "bg-[#efba6f] cursor-pointer" : "bg-[#f5d5a7]"}`}
    >
      <td className="p-2 w-16">
        <div className="flex flex-row justify-center">
          {work.publicationDate?.substring(0, 4) ?? "–"}
        </div>
      </td>
      <td className="p-2 pr-4">
        <div className="flex flex-col gap-1 justify-center">
          <span className="m-0">{work.title}</span>
          <br />
          <div
            className="h-2 rounded"
            style={{
              width: `${((work.views ?? 0) / maxViews) * 100 || 1}%`,
              backgroundColor: "#844826",
            }}
          ></div>
        </div>
      </td>
      <td className="p-2 w-16">
        {work.notable && (
          <div
            className="flex flex-row justify-center"
            title="Marked as notable"
          >
            ★
          </div>
        )}
      </td>
    </tr>
  );
}
