import Container from "@/components/Container";
import SubTitle from "@/components/SubTitle";
import Link from "next/link";

export default async function AboutPage() {
  return (
    <section aria-label="Contributions">
      <SubTitle>Found a Data Error?</SubTitle>
      <Container>
        <p>Good news!</p>
        <p>
          Book Bear is based on the wonderful{" "}
          <Link href="https://wikidata.org/">Wikidata</Link> database, which
          means you can help improve the data not just for this site, but for
          everyone.
        </p>
        <p>
          Read more about the <Link href="/about">rules to be included</Link> in
          Book Bear and add missing entities and properties, or correct any
          error you may find.
        </p>
        <p>
          Make sure to follow the{" "}
          <Link href="https://www.wikidata.org/wiki/Wikidata:List_of_policies_and_guidelines">
            Wikidata guidelines
          </Link>
          .
        </p>
      </Container>
      <SubTitle>Found a Technical Error?</SubTitle>
      <Container>
        <p>Good news!</p>
        <p>
          Book Bear is completely open source and MIT licensed. Get in touch or
          contribute to our{" "}
          <Link href="https://github.com/vegardege/bookbear">
            GitHub repository
          </Link>{" "}
          to improve the page.
        </p>
        <p>You can even fork it if I disagree with your changes.</p>
      </Container>
    </section>
  );
}
