import { notFound } from "next/navigation";
import BookBox from "@/components/BookBox";
import Container from "@/components/Container";
import GenreInfoModal from "@/components/GenreInfoModal";
import SubTitle from "@/components/SubTitle";
import Title from "@/components/Title";
import { getDatabase, type Work } from "@/lib/database";

type WorkGroup = {
	works: Work[];
	qcode?: string;
};

/**
 * Group works by their form of creative work and sort them by the number
 * of works in each group.
 */
function groupAndSortWorks(works: Work[]): Map<string, WorkGroup> {
	const groups = new Map<string, WorkGroup>();

	for (const work of works) {
		const key = work.formOfCreativeWork || "Other";
		if (!groups.has(key)) {
			groups.set(key, { works: [], qcode: work.formOfCreativeWorkQcode });
		}
		groups.get(key)?.works.push(work);
	}

	// Sort entries by number of views in group
	const sorted = [...groups.entries()].sort((a, b) => {
		const aViews = a[1].works.reduce((sum, work) => sum + (work.views || 0), 0);
		const bViews = b[1].works.reduce((sum, work) => sum + (work.views || 0), 0);

		return bViews - aViews;
	});
	return new Map(sorted);
}

function capitalizeWords(str: string): string {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Author page component.
 *
 * This page contains information about the author and their works.
 */
export default async function AuthorPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const database = getDatabase();
	const author = database.get(decodeURIComponent(id));
	if (!author) {
		notFound();
	}

	const workGroups = [...groupAndSortWorks(author.works).entries()];
	const maxViews = Math.max(...author.works.map((work) => work.views || 0), 1);

	return (
		<section aria-label="Author">
			<Title>{author.name}</Title>
			{workGroups.length > 0 ? (
				workGroups.map(([name, group]) => {
					const label = capitalizeWords(name);
					return (
						<div key={name}>
							<SubTitle
								action={
									<GenreInfoModal
										authorQcode={author.qcode}
										authorName={author.name}
										genreName={label}
										formQcode={group.qcode}
									/>
								}
							>
								{label}
							</SubTitle>
							<section aria-label={label} className="mx-1">
								<Container padding={false}>
									<ul className="min-w-full divide-y divide-divider divide-solid">
										{group.works.map((work) => (
											<BookBox
												key={work.qcode}
												work={work}
												maxViews={maxViews}
											/>
										))}
									</ul>
								</Container>
							</section>
						</div>
					);
				})
			) : (
				<section aria-label="Missing" className="my-4">
					<Container>
						<p>No works were found for this author.</p>
					</Container>
				</section>
			)}
		</section>
	);
}
