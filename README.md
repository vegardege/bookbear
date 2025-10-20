# Book Bear

[![Lint, Build, Deploy](https://github.com/vegardege/bookbear/actions/workflows/lint-build-deploy.yml/badge.svg)](https://github.com/vegardege/bookbear/actions/workflows/lint-build-deploy.yml)

Book Bear is a web page giving you an overview of the literary works of all authors known to Wikidata. The page displays whether the work is considered notable and how popular it is on Wikipedia (measured by page views).

**Live site:** [https://bookbear.pebblepatch.dev](https://bookbear.pebblepatch.dev)

## Motivation

This is a weekend project I created to scratch my own itch.

My goal was to create a quick and mobile-friendly site to guide me during library visits. By providing a simple overview of works per author with an indicator of popularity and notability, it's easier to decide which of an author's books to read first, or to check which books you haven't read of someone you've previously enjoyed.

> [!NOTE]
> This is a personal project shared in the spirit of open source. I haven't spent time making it production-ready for others. That said, the instructions below should help you reproduce it if you're interested.

## Quick Start

### Just want to try it?

The easiest way is to visit the live site: [https://bookbear.pebblepatch.dev](https://bookbear.pebblepatch.dev)

### Run with Docker (pre-built image)

If you have a `data/database.json` file ready (see [Building the Database](#building-the-database)):

```bash
docker run -p 3000:3000 -v ./data:/app/data vegardege/bookbear:latest
```

Then open [http://localhost:3000](http://localhost:3000)

## Full Setup

Want to build everything from scratch? Here's how.

### Prerequisites

- **Node.js** 20+ (the project uses Node.js 25 in Docker)
- **npm** (comes with Node.js)
- Basic familiarity with command line

### Building the Database

The core of Book Bear is a JSON database file that combines:

1. **Wikidata metadata** (authors, works, relationships)
2. **Wikipedia pageview statistics** (popularity metrics)

#### Step 1: Generate a `pageviews` database

Use [pvduck](https://github.com/vegardege/pvduck) to create a DuckDB database of Wikipedia pageviews. Follow the instructions in that repository to generate `pvduck.duckdb`.

This database aggregates Wikipedia pageview data to measure how popular each work is.

#### Step 2: Download and process Wikidata

```bash
# Install dependencies first
npm install

# Download raw data from Wikidata
npm run script authorships  # Author-work relationships
npm run script notables     # Notable work indicators

# Hydrate with detailed metadata
npm run script authors      # Author details (names, descriptions)
npm run script works        # Work details (titles, publication dates)

# Combine everything into one JSON file
npm run script aggregate /path/to/your/pvduck.duckdb
```

Each script downloads different pieces of data from Wikidata via [SPARQL](https://en.wikipedia.org/wiki/SPARQL) queries, then the `aggregate` command combines everything with pageview data into `data/database.json`.

**Note:** These scripts can take a while depending on Wikidata's response times. Downloaded files are cached in `data/` for subsequent runs. If you have problems with timeouts, try lowering the chunk size. You can specify offset as well if you want to run the script in separate chunks and combine manually later.

### Running the Web App

#### Development mode

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### Production mode

```bash
npm install
npm run build
npm run start
```

### Docker (build your own image)

```bash
# Build the image
docker build -t bookbear:latest .

# Run with volume mount for database
docker run -p 3000:3000 -v ./data:/app/data bookbear:latest
```

The database file (`data/database.json`) is changes frequently. Mounting it as a volume means you can update the data without rebuilding the Docker image, and that you can reuse the existing image with your own, adapted database.

## Development

### Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
npm run check        # Check for issues
npm run check:fix    # Auto-fix issues

npm run lint         # Lint only
npm run lint:fix     # Auto-fix lint issues

npm run format       # Format only
npm run format:fix   # Auto-fix formatting
```

### CLI Scripts

The data pipeline is managed through CLI scripts (see `scripts/cli.ts`):

```bash
npm run script <command> [options]

# Available commands:
#   authorships      Download author-work relationships
#   notables         Download notable work indicators
#   authors          Download author metadata
#   works            Download work metadata
#   aggregate <db>   Combine all data with pageviews
#   clean            Delete old data files (keeps most recent)

# Options:
#   --offset <n>     Skip first n results (default: 0)
#   --chunk <n>      Fetch n results per request (default: 50000)
```

## Contributing

This is a personal project, but contributions are welcome!

The best way to contribute improving the [Wikidata database](https://www.wikidata.org/) itself. Add missing books, fix author relationships, mark notable works. These improvements benefit everyone using Wikidata.

Suggestions to improve SPARQL queries, UI improvements, and bug fixes are appreciated. Feel free to open issues or pull requests.
