import Link from "next/link";
import BookBox from "@/components/BookBox";
import { Work } from "@/lib/database";
import PopularityBar from "@/components/PopularityBar";
import Star from "@/components/Star";

export default function Home() {
  const exampleWork = {
    title: "The Road",
    qcode: "Q1140295",
    slug: "The_Road_(novel)",
    publicationDate: "2006-03-28",
    views: 800,
    notable: true,
    formOfCreativeWork: "novel",
  } as Work;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md shadow-sm bg-card p-3 flex flex-col gap-4">
        <p>
          Welcome to <strong>Book Bear</strong>!
        </p>
        <p>
          Search for an author to find a list of their books with popularity and
          notability, e.g.:
        </p>
        <ul className="border-t border-b border-divider mx-4 my-2">
          <BookBox work={exampleWork} maxViews={1000} />
        </ul>
        <p>
          <div className="inline-block mx-2">
            <PopularityBar views={1000} maxViews={1000} width="w-8" />
          </div>
          shows how popular the book is compared to other works by the same
          author.
        </p>
        <p>
          <div className="inline-block mx-2">
            <Star />
          </div>
          tells you that the book is marked as notable.
        </p>
      </div>
      <div className="rounded-md shadow-sm bg-card p-3 flex flex-col gap-4">
        <p>Not sure where to start? Here are some of my recommendations:</p>
        <div className="flex flex-row justify-between mx-4 my-2 gap-2 text-sm font-bold">
          <Link
            className="bg-highlight hover:bg-background px-3 py-2 rounded-md shadow-sm"
            href="/author/Marilynne_Robinson"
          >
            Marilynne Robinson
          </Link>
          <Link
            className="bg-highlight hover:bg-background px-3 py-2 rounded-md shadow-sm"
            href="/author/Kazuo_Ishiguro"
          >
            Kazuo Ishiguro
          </Link>
          <Link
            className="bg-highlight hover:bg-background px-3 py-2 rounded-md shadow-sm"
            href="/author/Cormac_McCarthy"
          >
            Cormac McCarthy
          </Link>
          <Link
            className="bg-highlight hover:bg-background px-3 py-2 rounded-md shadow-sm"
            href="/author/Olga_Tokarczuk"
          >
            Olga Tokarczuk
          </Link>
        </div>
        <p>
          Book Bear is powered by Wikidata. Read more about how the data is
          generated and how you can contribute to the Wikidata project by
          following the links below.
        </p>
      </div>
    </div>
  );
}
