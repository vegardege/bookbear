/**
 * CLI entry point for the data pipeline scripts.
 */
import { loadPagesToCSV } from "./load-pages.js";
import { getNewPath } from "./storage.js";

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

// Entry point for CLI
const args = process.argv.slice(2);

switch (args[0]) {
  case "authorships":
    await authorships();
    break;
  case "notables":
    await notables();
    break;
  default:
    console.error(`Unknown command: ${args[0]}`);
    console.error("Usage: node cli.js <command>");
    console.error("Commands:");
    console.error(
      "  authorships - Create a CSV file with all author-work pairs"
    );
    break;
}
