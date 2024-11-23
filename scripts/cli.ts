/**
 * CLI entry point for the data pipeline scripts.
 */
import { createAuthorWorkFile } from "./pairs";

const args = process.argv.slice(2);

switch (args[0]) {
  case "pairs":
    createAuthorWorkFile();
    break;
  default:
    console.error(`Unknown command: ${args[0]}`);
    console.error("Usage: node cli.js <command>");
    console.error("Commands:");
    console.error("  pairs - Create a CSV file with all author-work pairs");
    break;
}
