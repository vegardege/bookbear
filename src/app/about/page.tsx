import Container from "@/components/Container";
import PopularityBar from "@/components/PopularityBar";
import Star from "@/components/Star";
import SubTitle from "@/components/SubTitle";

export default async function AboutPage() {
  return (
    <section aria-label="About" className="w-full">
      <SubTitle>How Does it Work?</SubTitle>
      <Container>
        <p>
          Book Bear is a wrapper around{" "}
          <a href="https://wikidata.org/">Wikidata</a>. Popularity is based on
          <a href="https://wikitech.wikimedia.org/wiki/Data_Platform/Data_Lake/Traffic/Pageviews">
            {" "}
            pageviews data
          </a>{" "}
          from the Wikimedia project.
        </p>
        <p>
          Listed below are the rules used to extract data. Get in touch if you
          think the rules can be improved, but note that I explicitly exclude
          e.g. the generic{" "}
          <a href="https://www.wikidata.org/wiki/Q36180">writer (Q36180)</a>{" "}
          because I want Book Bear to focus on fiction, poetry, and drama, not
          all published works by politicians, scientists, and other non-fiction
        </p>
      </Container>
      <h3 className="text-xl my-4">Authors</h3>
      <Container>
        <p>An author is any entity in the Wikidata database which:</p>
        <ul className="list-disc ml-6">
          <li>
            Is registered as the{" "}
            <a href="https://www.wikidata.org/wiki/Property:P50">
              author (P50)
            </a>{" "}
            of at least one work in Wikidata.
          </li>
          <li>
            Has an{" "}
            <a href="https://www.wikidata.org/wiki/Property:P106">
              occupation (P106)
            </a>{" "}
            of on of the following:
            <ul className="list-disc ml-6 my-2">
              <li>
                <a href="https://www.wikidata.org/wiki/Q482980">
                  Author (Q482980)
                </a>
              </li>
              <li>
                <a href="https://www.wikidata.org/wiki/Q49757">Poet (Q49757)</a>
              </li>
              <li>
                <a href="https://www.wikidata.org/wiki/Q6625963">
                  Novelist (Q6625963)
                </a>
              </li>
              <li>
                <a href="https://www.wikidata.org/wiki/Q214917">
                  Playwright (Q214917)
                </a>
              </li>
            </ul>
          </li>
          <li>
            Has an English{" "}
            <a href="https://www.wikidata.org/wiki/Help:Label">label</a> in
            Wikidata.
          </li>
          <li>Has an English Wikipedia article.</li>
        </ul>
      </Container>
      <h3 className="text-xl my-4">Work</h3>
      <Container>
        <p>A work is any entity in the Wikidata database which:</p>
        <ul className="list-disc ml-6">
          <li>
            Is an <a href="">instance of (P31)</a> on of the following:
            <ul className="list-disc ml-6 my-2">
              <li>
                <a href="https://www.wikidata.org/wiki/Q7725634">
                  Literary work (Q7725634)
                </a>
              </li>
              <li>
                <a href="https://www.wikidata.org/wiki/Q116476516">
                  Dramatic work (Q116476516)
                </a>
              </li>
              <li>
                <a href="https://www.wikidata.org/wiki/Q47461344">
                  Written work (Q47461344)
                </a>
              </li>
            </ul>
          </li>
          <li>
            Has an English{" "}
            <a href="https://www.wikidata.org/wiki/Help:Label">label</a> in
            Wikidata.
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
            <a href="https://www.wikidata.org/wiki/Property:P800">
              notable work (P800)
            </a>{" "}
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
          Book Bear is a <a href="https://nextjs.org/">next.js</a> app backed by{" "}
          <a href="https://nodejs.org/en">Node.js</a> scripts to sync data.
        </p>
        <p>
          All source code is MIT licensed and available on{" "}
          <a href="https://github.com/vegardege/bookbear">Github</a>.
        </p>
      </Container>
    </section>
  );
}
