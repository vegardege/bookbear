/**
 * CLI entry point for the data pipeline scripts.
 */
import { aggregateToCsv } from "./aggregate.js";
import { loadChunksToCSV } from "./loadChunks.js";
import { loadPagesToCSV } from "./loadPages.js";
import {
  getNewPath,
  getMostRecentFilename,
  getLatestAuthors,
  getLatestWorks,
} from "./storage.js";

async function authorships(): Promise<void> {
  const filename = getNewPath("authorships");
  const query = `
    SELECT ?author ?work
    WHERE {
        ?work   wdt:P31 ?workType ;     # Literary or dramatic work
                wdt:P50 ?author .       # which has a registered author
        
        VALUES ?workType { wd:Q7725634 wd:Q116476516 wd:Q47461344 }

        # Must be an author, novelist, playwright, or poet
        ?author p:P106 ?occupationStatement .
        ?occupationStatement ps:P106 ?occupation .

        FILTER ( 
          ?occupation IN (wd:Q482980, wd:Q49757, wd:Q6625963, wd:Q214917)
        )
    }`;
  await loadPagesToCSV(filename, query, 100_000);
}

async function notables(): Promise<void> {
  const filename = getNewPath("notables");
  const query = `
    SELECT ?author ?work
    WHERE {
        ?work wdt:P31 ?workType .    # Literary or dramatic work

        VALUES ?workType { wd:Q7725634 wd:Q116476516 wd:Q47461344 }

        ?author wdt:P800 ?work ;     # which is notable for an author
                p:P106 ?occupationStatement .
        ?occupationStatement ps:P106 ?occupation .

        FILTER ( 
          ?occupation IN (wd:Q482980, wd:Q49757, wd:Q6625963, wd:Q214917)
        )
    }`;
  await loadPagesToCSV(filename, query, 100_000);
}

async function authors(initialOffset: number): Promise<void> {
  const filename = getNewPath("authors");
  const authors = getLatestAuthors();
  const query = `
    SELECT ?author ?authorLabel ?authorDescription ?slug
    WHERE
    {
        # Use VALUES to limit the number of authors in the query
        VALUES ?author {
            {{chunk}}  # Placeholder for chunk of authors
        }

        # Get the author's label (name)
        ?author rdfs:label ?authorLabel .
        FILTER(LANG(?authorLabel) = "en")

        # Get the English Wikipedia page for the author
        ?article schema:about ?author ;
                 schema:name ?title ;
                 schema:isPartOf <https://en.wikipedia.org/> .
        
        # Create a slug from the title
        BIND(REPLACE(?title, " ", "_") AS ?slug)

        # Include an optional description in English, separating authors
        # with the same name
        OPTIONAL {
            ?author schema:description ?authorDescription .
            FILTER(LANG(?authorDescription) = "en")
        }
    }`;
  await loadChunksToCSV(filename, query, authors, initialOffset, 10_000);
}

async function works(initialOffset: number): Promise<void> {
  const filename = getNewPath("works");
  const works = getLatestWorks();
  const query = `
    SELECT
        ?work ?workLabel ?slug 
        (MIN(?publicationDate) AS ?minPublicationDate)
        (MIN(?formLabel) AS ?formOfCreativeWorkLabel)
    WHERE {
        VALUES ?work {
            {{chunk}}  # Placeholder
        }

        # Get the work's label (name)
        ?work rdfs:label ?workLabel.
        FILTER(LANG(?workLabel) = "en")

        # Get the publication date of the work if it exists
        OPTIONAL {
          ?work wdt:P577 ?publicationDate.
        }

        # Get the English Wikipedia page for the work if it exists
        OPTIONAL {
            ?article schema:about ?work ;
                    schema:name ?title ;
                    schema:isPartOf <https://en.wikipedia.org/>.
            BIND(REPLACE(?title, " ", "_") AS ?slug)
        }

        OPTIONAL {
            ?work wdt:P7937 ?form.
            ?form rdfs:label ?formLabel.
            FILTER(LANG(?formLabel) = "en")
        }
    }
    GROUP BY ?work ?workLabel ?slug`;
  await loadChunksToCSV(filename, query, works, initialOffset, 10_000);
}

async function aggregate(db_path: string): Promise<void> {
  const filename = getNewPath("aggregate", "json");
  const authors_path = getMostRecentFilename("authors");
  const works_path = getMostRecentFilename("works");
  const authorships_path = getMostRecentFilename("authorships");
  const notables_path = getMostRecentFilename("notables");

  if (!authors_path || !works_path || !authorships_path || !notables_path) {
    console.error("Missing required CSV files for aggregation.");
    return;
  }

  aggregateToCsv(
    filename,
    authors_path,
    works_path,
    authorships_path,
    notables_path,
    db_path
  );
}

// Entry point for CLI
const args = process.argv.slice(2);

switch (args[0]) {
  case "authorships":
    await authorships();
    break;
  case "notables":
    await notables();
    break;
  case "authors":
    await authors(args[1] ? parseInt(args[1]) : 0);
    break;
  case "works":
    await works(args[1] ? parseInt(args[1]) : 0);
    break;
  case "aggregate":
    await aggregate(args[1]);
    break;
  default:
    console.error(`Unknown command: ${args[0]}`);
    console.error("Usage: node run script <command>");
    console.error("Commands:");
    console.error(
      "  authorships - Create a CSV file with all author-work pairs" +
        "  notables - Create a CSV file with all notable author-work pairs" +
        "  authors - Create a CSV file with detailed author data" +
        "  works - Create a CSV file with detailed works data" +
        "  aggregate /path/to/db.duckdb - Aggregate the data in the database"
    );
    break;
}
