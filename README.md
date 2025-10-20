# Book Bear

[![Lint, Build, Deploy](https://github.com/vegardege/bookbear/actions/workflows/lint-build-deploy.yml/badge.svg)](https://github.com/vegardege/bookbear/actions/workflows/lint-build-deploy.yml)

Book Bear is a web page giving you an overview of the literary works of all
authors known to Wikidata. The page displays whether the work is considered
notable and how popular it is on Wikipedia (measured by page views).

The web page is live on
[https://bookbear.pebblepatch.dev](https://bookbear.pebblepatch.dev).

## Motivation

The page was a weekend project I created to scratch my own itch.

My goal was to create a quick and mobile friendly site to guide me during
library visits. By providing a simple overview of works per author with an
indicator of popularity and notability, it's easier to decide which of an
author's books to read first, or to check which books you haven't read of
someone you've previously enjoyed.

Contributions are primarily made by improving the Wikidata database, but
suggestions to improve SPARQL queries and the page itself are also welcome.

## Getting Started

> [!NOTE]
> The source of this project is shared in the spirit of sharing. I have not
> tried to make it easy to reproduce the page from scratch. The instructions
> below may be lacking.

To build the page from scratch, the first thing you need is a pageviews
database. This is the measure of book popularity, which is at the core of the
page. The database can be generated using
[pvduck](https://github.com/vegardege/pvduck). Follow instructions in that
project to get your own db.

Once you are happy with your pageviews aggregation, you need to download meta
data from Wikidata and aggregate it in to a JSON file, which is used by the
backend:

```bash
# First, get Q codes for author-work relationships and notable status
npm run script authorships
npm run script notables

# Second, hydrate the author and work objects with data
npm run script authors
npm run script works

# Third, aggregate all files into one
npm run script aggregate /path/to/your/pvduck.duckdb
```

Once the JSON file has been created, you can run the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see
the result.

You can also build it and run with:

```bash
npm run build
npm run start
```

## Run in Docker

The Docker version contains the web page only, the underlying JSON file must
still be created in your local environment. Once you have the file, run:

```bash
docker build -t bookbear:latest .
docker run -p 3000:3000 -v ./data:/app/data bookbear:latest
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to
see the result.

## Development

This project uses [biome](https://biomejs.dev/) for linting and formatting.
The following commands are available:

```bash
npm run check
npm run check:fix
npm run lint
npm run lint:fix
npm run format
npm run format:fix
```
