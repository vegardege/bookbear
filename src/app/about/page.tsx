import Container from "@/components/Container";
import PopularityBar from "@/components/PopularityBar";
import Star from "@/components/Star";
import SubTitle from "@/components/SubTitle";
import Link from "next/link";

export default async function AboutPage() {
  return (
    <section aria-label="About" className="w-full">
      <SubTitle>How Does it Work?</SubTitle>
      <Container>
        <p>
          Book Bear is a wrapper around{" "}
          <Link href="https://wikidata.org/">Wikidata</Link>. Popularity is
          based on{" "}
          <Link href="https://wikitech.wikimedia.org/wiki/Data_Platform/Data_Lake/Traffic/Pageviews">
            pageviews data
          </Link>{" "}
          from the Wikimedia project.
        </p>
        <p>
          Listed below are the rules used to extract data. Get in touch if you
          think the rules can be improved, but note that I explicitly exclude
          e.g. the generic{" "}
          <Link href="https://www.wikidata.org/wiki/Q36180">
            writer (Q36180)
          </Link>{" "}
          because I want Book Bear to focus on fiction, poetry, and drama, not
          on all published works.
        </p>
      </Container>
      <h3 className="text-xl my-4">Authors</h3>
      <Container>
        <p>An author is any entity in the Wikidata database which:</p>
        <ul className="list-disc ml-6">
          <li>
            Is registered as the{" "}
            <Link href="https://www.wikidata.org/wiki/Property:P50">
              author (P50)
            </Link>{" "}
            of at least one work in Wikidata.
          </li>
          <li>
            Has an{" "}
            <Link href="https://www.wikidata.org/wiki/Property:P106">
              occupation (P106)
            </Link>{" "}
            of on of the following:
            <ul className="list-disc ml-6 my-2">
              <li>
                <Link href="https://www.wikidata.org/wiki/Q482980">
                  Author (Q482980)
                </Link>
              </li>
              <li>
                <Link href="https://www.wikidata.org/wiki/Q49757">
                  Poet (Q49757)
                </Link>
              </li>
              <li>
                <Link href="https://www.wikidata.org/wiki/Q6625963">
                  Novelist (Q6625963)
                </Link>
              </li>
              <li>
                <Link href="https://www.wikidata.org/wiki/Q214917">
                  Playwright (Q214917)
                </Link>
              </li>
            </ul>
          </li>
          <li>
            Has an English{" "}
            <Link href="https://www.wikidata.org/wiki/Help:Label">label</Link>{" "}
            in Wikidata.
          </li>
          <li>Has an English Wikipedia article.</li>
        </ul>
      </Container>
      <h3 className="text-xl my-4">Work</h3>
      <Container>
        <p>A work is any entity in the Wikidata database which:</p>
        <ul className="list-disc ml-6">
          <li>
            Is an <Link href="">instance of (P31)</Link> on of the following:
            <ul className="list-disc ml-6 my-2">
              <li>
                <Link href="https://www.wikidata.org/wiki/Q7725634">
                  Literary work (Q7725634)
                </Link>
              </li>
              <li>
                <Link href="https://www.wikidata.org/wiki/Q116476516">
                  Dramatic work (Q116476516)
                </Link>
              </li>
              <li>
                <Link href="https://www.wikidata.org/wiki/Q47461344">
                  Written work (Q47461344)
                </Link>
              </li>
            </ul>
          </li>
          <li>
            Has an English{" "}
            <Link href="https://www.wikidata.org/wiki/Help:Label">label</Link>{" "}
            in Wikidata.
          </li>
        </ul>
      </Container>
      <h3 className="text-xl my-4">Notability</h3>
      <Container>
        <div>
          A work is marked as notable (
          <div className="inline-flex">
            <Star />
          </div>
          ) for an author if it:
        </div>
        <ul className="list-disc ml-6">
          <li>Fits the definition of a Work as defined above.</li>
          <li>
            Is registered as a{" "}
            <Link href="https://www.wikidata.org/wiki/Property:P800">
              notable work (P800)
            </Link>{" "}
            of the author in Wikidata.
          </li>
        </ul>
      </Container>
      <h3 className="text-xl my-4">Popularity</h3>
      <Container>
        <div>
          The popularity (
          <div className="inline-flex">
            <PopularityBar views={1} maxViews={1} width="w-6" />
          </div>
          ) of a work is based on the number of pageviews its English Wikipedia
          page has received relative to other works of the same author.
        </div>
        <p>
          Pageviews are sampled from Wikimedia's own pageviews dumps, and should
          only be used as an indicator of relative popularity, not an absolute
          measurement.
        </p>
      </Container>
      <h3 className="text-xl my-4">Source Code</h3>
      <Container>
        <p>
          Book Bear is a <Link href="https://nextjs.org/">next.js</Link> app
          backed by <Link href="https://nodejs.org/en">Node.js</Link> scripts to
          sync data.
        </p>
        <p>
          All source code is MIT licensed and available on{" "}
          <Link href="https://github.com/vegardege/bookbear">Github</Link>.
        </p>
      </Container>
    </section>
  );
}
