import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { getTimestamp } from "./utils.js";

/**
 * Request a path for a new CSV file in a given group.
 */
export function getNewPath(group: string): string {
  const dir = getDataDir();
  const fn = `${group}-${getTimestamp()}.csv`;

  return path.join(dir, fn);
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
