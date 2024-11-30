import BookBox from "@/components/BookBox";
import Container from "@/components/Container";
import PopularityBar from "@/components/PopularityBar";
import Star from "@/components/Star";
import { Work } from "@/lib/database";

const exampleWork = {
  title: "Blood Meridian",
  qcode: "Q581426",
  slug: "Blood_Meridian",
  publicationDate: "1985-02-01",
  views: 1000,
  notable: true,
  formOfCreativeWork: "novel",
} as Work;

export default function HelpBox() {
  return (
    <Container>
      <p>
        Search for an author to find a list of their books with popularity and
        notability, e.g.:
      </p>
      <ul>
        <BookBox work={exampleWork} maxViews={1000} />
      </ul>
      <div>
        <span className="inline-block mx-3">
          <PopularityBar views={1000} maxViews={1000} width="w-6" />
        </span>
        shows how popular the book is relative to other works by the same
        author.
      </div>
      <div>
        <span className="mx-2 w-8 inline-flex flex-col justify-center">
          <Star />
        </span>
        tells you that the book is marked as notable in Wikidata.
      </div>
    </Container>
  );
}
