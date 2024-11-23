/**
 * CLI entry point for the data pipeline scripts.
 */
import { loadChunksToCSV } from "./load-chunks.js";
import { loadPagesToCSV } from "./load-pages.js";
import { getNewPath, getLatestAuthors, getLatestWorks } from "./storage.js";

async function authorships(): Promise<void> {
  const filename = getNewPath("authorships");
  const query = `
    SELECT ?author ?work
    WHERE {
        ?work   wdt:P31 wd:Q7725634 ; # Instance of 'literary work'
                wdt:P50 ?author .     # which has a registered author
        ?author wdt:P31 wd:Q5 .       # who is a human being
    }`;
  await loadPagesToCSV(filename, query, 10_000);
}

async function notables(): Promise<void> {
  const filename = getNewPath("notables");
  const query = `
    SELECT ?author ?work
    WHERE {
        ?work wdt:P31 wd:Q7725634 .  # Instance of 'literary work'
        ?author wdt:P800 ?work .     # which is notable for an author
        ?author wdt:P31 wd:Q5 .      # who is a human being
    }`;
  await loadPagesToCSV(filename, query, 10_000);
}

async function authors(): Promise<void> {
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

        # Get the English Wikipedia page for the author
        ?article schema:about ?author ;
                 schema:name ?title ;
                 schema:isPartOf <https://en.wikipedia.org/> .
        
        # Create a slug from the title
        BIND(REPLACE(?title, " ", "_") AS ?slug)
        
        # Get the author's label and optionally a description in English
        ?author rdfs:label ?authorLabel .
        FILTER(LANG(?authorLabel) = "en")

        OPTIONAL {
            ?author schema:description ?authorDescription .
            FILTER(LANG(?authorDescription) = "en")
        }
    }`;
  await loadChunksToCSV(filename, query, authors, 1000);
}

async function works(): Promise<void> {
  const filename = getNewPath("works");
  const works = getLatestWorks();
  const query = `
        SELECT ?work ?workLabel ?slug ?publicationDate
        WHERE
        {
            VALUES ?work {
                {{chunk}}  # Placeholder for chunk of works
            }
        
            OPTIONAL {
                ?work wdt:P577 ?publicationDate .
            }
            
            ?work rdfs:label ?workLabel .
            FILTER(LANG(?workLabel) = "en")
            
            OPTIONAL {
                ?article schema:about ?work ;
                        schema:name ?title ;
                        schema:isPartOf <https://en.wikipedia.org/> .
                
                BIND(REPLACE(?title, " ", "_") AS ?slug)
            }
        }
    `;
  await loadChunksToCSV(filename, query, works, 1000);
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
  default:
    console.error(`Unknown command: ${args[0]}`);
    console.error("Usage: node run script <command>");
    console.error("Commands:");
    console.error(
      "  authorships - Create a CSV file with all author-work pairs" +
        "  notables - Create a CSV file with all notable author-work pairs" +
        "  authors - Create a CSV file with detailed author data" +
        "  works - Create a CSV file with detailed works data"
    );
    break;
}
