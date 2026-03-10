"use client";
import type { Work } from "@/lib/database";
import PopularityBar from "./PopularityBar";
import Star from "./Star";

function WikipediaIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			width="1em"
			height="1em"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			aria-hidden="true"
		>
			<circle cx="10" cy="10" r="8.5" />
			<ellipse cx="10" cy="10" rx="4" ry="8.5" />
			<line x1="1.5" y1="10" x2="18.5" y2="10" />
			<line x1="3" y1="5.5" x2="17" y2="5.5" />
			<line x1="3" y1="14.5" x2="17" y2="14.5" />
		</svg>
	);
}

function WikidataIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			width="1em"
			height="1em"
			fill="currentColor"
			aria-hidden="true"
		>
			<rect x="1.5" y="4" width="2.5" height="12" />
			<rect x="5.5" y="4" width="1.5" height="12" />
			<rect x="8.5" y="4" width="2.5" height="12" />
			<rect x="12.5" y="4" width="1.5" height="12" />
			<rect x="15.5" y="4" width="3" height="12" />
		</svg>
	);
}

const shelfLinkClass =
	"inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded border border-divider no-underline hover:bg-highlight cursor-pointer";

export default function BookBox({
	work,
	maxViews,
	showYear = true,
	isOpen = false,
	onToggleAction,
}: {
	work: Work;
	maxViews: number;
	showYear?: boolean;
	isOpen?: boolean;
	onToggleAction?: () => void;
}) {
	return (
		<li>
			<button
				type="button"
				onClick={onToggleAction}
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
				<div className="flex flex-wrap gap-2 px-2 py-3 justify-center">
					{work.slug ? (
						<>
							<a
								href={`https://en.wikipedia.org/wiki/${work.slug}`}
								target="_blank"
								rel="noopener noreferrer"
								className={shelfLinkClass}
							>
								<WikipediaIcon /> Wikipedia
							</a>
							<a
								href={`https://www.wikidata.org/wiki/${work.qcode}`}
								target="_blank"
								rel="noopener noreferrer"
								className={shelfLinkClass}
							>
								<WikidataIcon /> Wikidata
							</a>
						</>
					) : (
						<a
							href={`https://www.wikidata.org/wiki/${work.qcode}`}
							target="_blank"
							rel="noopener noreferrer"
							className={shelfLinkClass}
						>
							<WikidataIcon /> Wikidata
						</a>
					)}
				</div>
			)}
		</li>
	);
}
