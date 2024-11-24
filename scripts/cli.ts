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
        ?author wdt:P31 wd:Q5 .         # who is a human being

        VALUES ?workType { wd:Q7725634 wd:Q116476516 }
    }`;
  await loadPagesToCSV(filename, query, 10_000);
}

async function notables(): Promise<void> {
  const filename = getNewPath("notables");
  const query = `
    SELECT ?author ?work
    WHERE {
        ?work wdt:P31 ?workType .    # Literary or dramatic work
        ?author wdt:P800 ?work .     # which is notable for an author
        ?author wdt:P31 wd:Q5 .      # who is a human being

        VALUES ?workType { wd:Q7725634 wd:Q116476516 }
    }`;
  await loadPagesToCSV(filename, query, 10_000);
}

async function authors(): Promise<void> {
  const filename = getNewPath("authors");
  const authors = getLatestAuthors();
  const query = `
    SELECT ?author ?authorLabel ?authorDescription ?slug ?isAuthor
    WHERE
    {
        # Use VALUES to limit the number of authors in the query
        VALUES ?author {
            {{chunk}}  # Placeholder for chunk of authors
        }

        # Get the English Wikipedia page for the author
        ?article schema:about ?author ;
                 schema:name ?title ;
                 schema:isPartOf <https://en.wikipedia.org/> .
        
        # Create a slug from the title
        BIND(REPLACE(?title, " ", "_") AS ?slug)
        
        # Get the author's label (name)
        ?author rdfs:label ?authorLabel .
        FILTER(LANG(?authorLabel) = "en")

        # Include an optional description in English, separating authors
        # with the same name
        OPTIONAL {
            ?author schema:description ?authorDescription .
            FILTER(LANG(?authorDescription) = "en")
        }

        # Check if the person is a writer by occupation
        BIND(EXISTS {
            ?author wdt:P106 ?occupation .
            FILTER(?occupation IN (
                wd:Q482980, wd:Q49757, wd:Q6625963, wd:Q214917
            ))
        } AS ?isAuthor)
    }`;
  await loadChunksToCSV(filename, query, authors, 1000);
}

async function works(): Promise<void> {
  const filename = getNewPath("works");
  const works = getLatestWorks();
  const query = `
    SELECT
        ?work ?workLabel ?slug ?publicationDate
        (MIN(?formLabel) AS ?formOfCreativeWorkLabel)
    WHERE {
        VALUES ?work {
            {{chunk}}  # Placeholder
        }

        OPTIONAL { ?work wdt:P577 ?publicationDate. }

        ?work rdfs:label ?workLabel.
        FILTER(LANG(?workLabel) = "en")

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
    GROUP BY ?work ?workLabel ?slug ?publicationDate`;
  await loadChunksToCSV(filename, query, works, 1000);
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
    await authors();
    break;
  case "works":
    await works();
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
