"use client";
import type { Work } from "@/lib/database";
import PopularityBar from "./PopularityBar";
import Star from "./Star";

export default function BookBox({
	work,
	maxViews,
	showYear = true,
	isOpen = false,
	onToggle,
}: {
	work: Work;
	maxViews: number;
	showYear?: boolean;
	isOpen?: boolean;
	onToggle?: () => void;
}) {
	return (
		<li>
			<button
				type="button"
				onClick={onToggle}
				className="flex flex-row items-center py-3 w-full text-left no-underline hover:bg-highlight hover:cursor-pointer"
			>
				{showYear && (
					<div className="flex flex-row w-16 justify-center text-sm">
						{work.publicationYear != null ? (
							<time dateTime={String(work.publicationYear)}>
								{work.publicationYear < 0
									? `${Math.abs(work.publicationYear)} BCE`
									: work.publicationYear}
							</time>
						) : (
							<span>–</span>
						)}
					</div>
				)}
				<div className="flex-1 flex flex-col gap-2 justify-center mx-1">
					<span className="m-0 leading-none">{work.title}</span>
					<PopularityBar views={work.views ?? 0} maxViews={maxViews} />
				</div>
				<div className="w-14">{work.notable && <Star />}</div>
			</button>
			{isOpen && (
				<div className="flex gap-4 px-2 pb-3 text-sm">
					{work.slug ? (
						<>
							<a
								href={`https://en.wikipedia.org/wiki/${work.slug}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-muted"
							>
								Wikipedia
							</a>
							<a
								href={`https://www.wikidata.org/wiki/${work.qcode}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-muted"
							>
								Wikidata
							</a>
						</>
					) : (
						<>
							<a
								href={`https://www.wikidata.org/wiki/${work.qcode}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-muted"
							>
								Wikidata
							</a>
							<a
								href={`https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(work.title)}&action=edit`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-muted"
							>
								Create Wikipedia article
							</a>
						</>
					)}
				</div>
			)}
		</li>
	);
}
