# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-03-05

### Added
- Genre info modal on author pages explaining each work category
- Automated retries on `5xx` errors from Wikidata API
- Form of creative work Q-code stored in pipeline for richer genre data
- "No results" message on search page when query returns nothing
- Search tie-breaking by page views when relevance scores are equal

### Changed
- Publication dates replaced by publication year (`publicationYear: number`) — supports BCE works, with ancient years displayed as e.g. "399 BCE"
- Upgraded `react`, `next`, `downshift`, and all dev dependencies

### Fixed
- External links now open with `rel="noopener noreferrer"`
- Improved error handling in pipelines
- Correct ARIA label and name on contact page

## [1.3.0] - 2025-12-06

### Added
- Proper ARIA labels on search component for accessibility
- Debounce on search input to reduce unnecessary queries
- Improved error handling and recovery actions on search results page

### Fixed
- 404 error handling on author pages

## [1.2.0] - 2025-12-06

### Changed
- Upgraded `next` and `react` in response to a critical CVE
- Aggregation pipeline queries now use parameterized inputs
- Docker image built and deployed via GitHub Actions

### Fixed
- Double URL decode bug on author pages
- Bug in search tie-breaker ranking

## [1.1.0] - 2025-10-20

### Added
- `clean` command in data pipeline to remove old cached files
- `commander`-based CLI for pipeline scripts
- Dockerfile for production deployment
- GitHub Actions workflow for lint and format checks

### Changed
- Replaced `eslint` and `prettier` with `biome`
- Replaced `axios` with native `fetch`
- Upgraded to Tailwind v4, Next.js and React latest
- Biome formatting applied across the entire codebase
- SPARQL queries moved to dedicated `sparql.ts` file

## [1.0.0] - 2024-12-01

### Added
- Initial release
- Author search with Fuse.js fuzzy matching and Downshift autocomplete
- Author pages showing works grouped by type, sorted by publication date
- Popularity bar visualising Wikipedia pageviews on a logarithmic scale
- Notable works marked with a star (sourced from Wikidata `P800`)
- About, contributions, and contact pages
- Data pipeline: SPARQL queries to Wikidata combined with pvduck pageview data
- XDG-compliant storage for pipeline CSV cache files
- Basic theming with CSS custom properties
