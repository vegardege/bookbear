# Book Bear

Book Bear is a web page giving you an overview of the literary works of all
authors known to Wikidata. The page displays whether the work is considered
notable and how popular it is on Wikipedia.

## Motivation

The page was a weekend project I created to scratch my own itch.

My goal was to create a quick and mobile friendly site to guide me during
library visits. A simple overview of works per author with an indicator of
popularity and notability.

Contributions are primarily made by improving the Wikidata database, but
suggestions to improve SPARQL queries and the page itself are also welcome.

## Getting Started

> [!NOTE]
> The source of this project is shared in the spirit of sharing. I have not
> tried to make it easy to reproduce the page from scratch. The instructions
> below may be lacking.

To build the page from scratch, you need a pageviews database. This file is
generated by [pvduck](https://github.com/vegardege/pvduck).

Once you are happy with your pageviews aggregation, you need to download data
from Wikidata and aggregate it in to a JSON file:

```bash
# First, get Q codes for author-work relationships and notable status
npm run scripts authorships
npm run scripts notables

# Second, hydrate the author and work objects with data
npm run scripts authors
npm run scripts works

# Third, aggregate all files into one
npm run scripts aggregate /path/to/your/pvduck.duckdb
```

Once the file is ready, you can run the frontend:

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

```bash
docker build -t bookbear:latest .
docker run -p 3000:3000 -v ./data:/app/data bookbear:latest
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to
see the result.
