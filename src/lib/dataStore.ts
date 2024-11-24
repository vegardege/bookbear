import fs from "fs";
import path from "path";

export type Author = {
  qcode: string;
  name: string;
  description: string;
  slug: string;
  views: number;
  works: Work[];
  isAuthor: boolean;
};

export type Work = {
  qcode: string;
  title: string;
  slug?: string;
  publicationDate?: string;
  views?: number;
  notable: boolean;
  formOfCreativeWork?: string;
};

const database = new Map<string, Author>();

/**
 * Get the cached database of authors and works.
 */
export function getDatabase(): Map<string, Author> {
  if (database.size === 0) {
    const data_path = path.join(process.cwd(), "data", "database.json");
    if (!fs.existsSync(data_path)) {
      throw new Error("Database file not found");
    }
    const data = fs.readFileSync(data_path, { encoding: "utf-8" });
    const authors = JSON.parse(data) as Author[];
    for (const author of authors) {
      database.set(author.slug, author);
    }
  }
  return database;
}
