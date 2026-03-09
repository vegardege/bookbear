"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
	authorQcode: string;
	authorName: string;
	genreName: string;
	formQcode?: string;
};

export default function GenreInfoModal({
	authorQcode,
	authorName,
	genreName,
	formQcode,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) return;
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setIsOpen(false);
		}
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [isOpen]);

	const authorUrl = `https://www.wikidata.org/wiki/${authorQcode}`;
	const formUrl = formQcode
		? `https://www.wikidata.org/wiki/${formQcode}`
		: null;
	const isOther = genreName === "Other";

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="flex self-center items-center justify-center text-foreground hover:bg-highlight cursor-pointer text-2xl font-light leading-none px-2 py-1 rounded"
				aria-label={`About the ${genreName} section`}
			>
				?
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
						onClick={() => setIsOpen(false)}
						tabIndex={-1}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="genre-modal-title"
						className="relative z-10 bg-card rounded-md shadow-lg p-6 max-w-md mx-4"
					>
						<div className="flex items-center justify-between mb-3">
							<h3 id="genre-modal-title" className="text-xl font-semibold">
								{genreName}
							</h3>
							<button
								type="button"
								// biome-ignore lint/a11y/noAutofocus: moves focus into modal for keyboard users
								autoFocus
								onClick={() => setIsOpen(false)}
								className="text-foreground/50 hover:text-foreground cursor-pointer text-lg leading-none focus:outline-none"
								aria-label="Close"
							>
								✕
							</button>
						</div>
						<p className="mb-2 text-sm">
							Works are included because their Wikidata entry has:
						</p>
						<ul className="mb-4 text-sm list-disc list-inside space-y-1">
							<li>
								<a
									href="https://www.wikidata.org/wiki/Property:P31"
									target="_blank"
									rel="noopener noreferrer"
								>
									instance of (P31)
								</a>{" "}
								set to a literary or dramatic work
							</li>
							<li>
								<a
									href="https://www.wikidata.org/wiki/Property:P50"
									target="_blank"
									rel="noopener noreferrer"
								>
									author (P50)
								</a>{" "}
								set to{" "}
								<a href={authorUrl} target="_blank" rel="noopener noreferrer">
									{authorName} ({authorQcode})
								</a>
							</li>
							<li>
								<a
									href="https://www.wikidata.org/wiki/Property:P7937"
									target="_blank"
									rel="noopener noreferrer"
								>
									form of creative work (P7937)
								</a>{" "}
								{isOther ? (
									<>not recorded</>
								) : formUrl ? (
									<>
										set to{" "}
										<a href={formUrl} target="_blank" rel="noopener noreferrer">
											{genreName} ({formQcode})
										</a>
									</>
								) : (
									<>set to {genreName}</>
								)}
							</li>
						</ul>
						<p className="mb-2 text-sm">
							Fix any errors you see by contributing to Wikidata directly.
						</p>

						<hr className="border-divider my-4" />

						<div className="flex items-center gap-3 mb-3 text-sm">
							<div className="shrink-0 w-12 rounded h-2 bg-divider">
								<div className="bg-bar h-2 rounded w-3/5" />
							</div>
							<span>
								The bar shows relative Wikipedia page views — longer means more
								popular.
							</span>
						</div>

						<div className="flex items-center gap-3 text-sm">
							<div className="shrink-0 w-12 flex justify-center">
								<Image
									src="/star.svg"
									alt="star"
									width={14}
									height={14}
									aria-hidden={true}
								/>
							</div>
							<span>
								The star marks works listed as{" "}
								<a
									href="https://www.wikidata.org/wiki/Property:P800"
									target="_blank"
									rel="noopener noreferrer"
								>
									notable work (P800)
								</a>{" "}
								on the author's Wikidata page.
							</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
