import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { parse } from "csv-parse/sync";

/**
 * Request a path for a new CSV file in a given group.
 */
export function getNewPath(group: string): string {
  const dir = getDataDir();
  const fn = `${group}-${getTimestamp()}.csv`;

  return path.join(dir, fn);
}

/**
 * Get all unique author Q codes from the most recent authorships CSV file.
 */
export function getLatestAuthors(): string[] {
  const csvPath = getLatestAuthorshipsFilename();
  return [...new Set(readCSV(csvPath).map((row) => row[0]))];
}

/**
 * Get all unique work Q codes from the most recent authorships CSV file.
 */
export function getLatestWorks(): string[] {
  const csvPath = getLatestAuthorshipsFilename();
  return [...new Set(readCSV(csvPath).map((row) => row[1]))];
}

/**
 * Parse a CSV file and return the rows as an array of tuples.
 */
function readCSV(csvPath: string | null): [string, string][] {
  if (!csvPath) {
    return [];
  }

  const data = fs.readFileSync(path.join(getDataDir(), csvPath), {
    encoding: "utf-8",
  });

  return parse(data, {
    columns: false,
    trim: true,
    skip_empty_lines: true,
    skip_records_with_error: true,
  });
}

/**
 * Get the path to the latest authorships CSV file.
 */
function getLatestAuthorshipsFilename(): string | null {
  const files = fs
    .readdirSync(getDataDir(), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => entry.name.startsWith("authorships-"));

  if (files.length === 0) {
    return null;
  }
  return files.sort().at(-1)?.name ?? null;
}

/**
 * Get the user's configured XDG data dir or default.
 */
function getDataDir(): string {
  const userXdgDataDir = process.env.XDG_DATA_HOME;
  const xdgDataDir =
    userXdgDataDir && userXdgDataDir.trim() !== ""
      ? userXdgDataDir
      : path.join(os.homedir(), ".local", "share");

  const bookbearDir = path.join(xdgDataDir, "bookbear");
  if (!fs.existsSync(bookbearDir)) {
    fs.mkdirSync(bookbearDir, { recursive: true });
  }
  return bookbearDir;
}

/**
 * Get the current timestamp in the format YYYYMMDD-HHMMSS.
 */
function getTimestamp(): string {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // getMonth() is 0-based
  const day = pad(now.getDate());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}
