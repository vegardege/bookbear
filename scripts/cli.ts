/**
 * CLI entry point for the data pipeline scripts.
 */
import { createAuthorWorkFile as createAuthorshipCSV } from "./authorships";
import { getTimestamp } from "./utils.js";

const args = process.argv.slice(2);

switch (args[0]) {
  case "authorships":
    const filename = `authorships-${getTimestamp()}.csv`;
    createAuthorshipCSV(filename);
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
