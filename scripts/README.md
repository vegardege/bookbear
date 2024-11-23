# Bookbear Scripts

The scripts in this directory are used to download data from Wikidata and
store them locally as CSV files.

Because we are requesting quite a lot of data, and Blazegraph is easily
overwhelmed by complicated queries, we get data in a stepwise process:

1. Download all known author–work pairs as Q codes only
2. Hydrate authors and works respectively
3. Aggregate the three downloaded files into one file, combined with view
   counts from a `pvduck` generated database.

## Commands

```bash
# First, get Q codes for author-work relationships and notable status
npm run scripts authorships
npm run scripts notables

# Second, hydrate the author and work objects with data

# Third, aggregate all files into one

```
