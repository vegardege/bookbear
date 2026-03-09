"use client";
import { useState } from "react";
import type { Work } from "@/lib/database";
import BookBox from "./BookBox";

export default function BookList({
	works,
	maxViews,
}: {
	works: Work[];
	maxViews: number;
}) {
	const [openQcode, setOpenQcode] = useState<string | null>(null);
	return (
		<ul className="min-w-full divide-y divide-divider divide-solid">
			{works.map((work) => (
				<BookBox
					key={work.qcode}
					work={work}
					maxViews={maxViews}
					isOpen={openQcode === work.qcode}
					onToggle={() =>
						setOpenQcode((prev) => (prev === work.qcode ? null : work.qcode))
					}
				/>
			))}
		</ul>
	);
}
