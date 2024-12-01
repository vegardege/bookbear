export const AUTHORSHIP_QUERY = `
SELECT ?author ?work
WHERE {
    # Get literary or dramatic works with a registered author
    ?work wdt:P31 ?workType ;
            wdt:P50 ?author .
    
    # Only include works of fiction
    VALUES ?workType { wd:Q7725634 wd:Q116476516 wd:Q47461344 }

    # Only include occupational authors, novelists, playwrights, poets
    ?author p:P106 ?occupationStatement .
    ?occupationStatement ps:P106 ?occupation .

    FILTER ( 
        ?occupation IN (wd:Q482980, wd:Q49757, wd:Q6625963, wd:Q214917)
    )
}`;

export const NOTABLES_QUERY = `
SELECT ?author ?work
WHERE {
    # Get literary or dramatic works
    ?work wdt:P31 ?workType ;
            wdt:P50 ?author .

    # Only include works of fiction
    VALUES ?workType { wd:Q7725634 wd:Q116476516 wd:Q47461344 }

    # Only include works notable for the author
    ?author wdt:P800 ?work ;
            p:P106 ?occupationStatement .
    ?occupationStatement ps:P106 ?occupation .

    FILTER ( 
        ?occupation IN (wd:Q482980, wd:Q49757, wd:Q6625963, wd:Q214917)
    )
}`;

export const AUTHORS_QUERY = `
SELECT ?author ?authorLabel ?authorDescription ?slug
WHERE
{
    # Use VALUES to limit the number of authors in the query
    VALUES ?author {
        {{chunk}}  # Placeholder for chunk of authors
    }

    # Get the author's label (name)
    ?author rdfs:label ?authorLabel .
    FILTER(LANG(?authorLabel) = "en")

    # Get the English Wikipedia page for the author
    ?article schema:about ?author ;
                schema:name ?title ;
                schema:isPartOf <https://en.wikipedia.org/> .
    
    # Create a slug from the title
    BIND(REPLACE(?title, " ", "_") AS ?slug)

    # Include an optional description in English, separating authors
    # with the same name
    OPTIONAL {
        ?author schema:description ?authorDescription .
        FILTER(LANG(?authorDescription) = "en")
    }
}`;

export const WORKS_QUERY = `
SELECT
    ?work ?workLabel ?slug 
    (MIN(?publicationDate) AS ?minPublicationDate)
    (MIN(?formLabel) AS ?formOfCreativeWorkLabel)
WHERE {
    VALUES ?work {
        {{chunk}}  # Placeholder for chunk of authors
    }

    # Get the work's label (name)
    ?work rdfs:label ?workLabel.
    FILTER(LANG(?workLabel) = "en")

    # Get the publication date of the work if it exists
    OPTIONAL {
        ?work wdt:P577 ?publicationDate.
    }

    # Get the English Wikipedia page for the work if it exists
    OPTIONAL {
        ?article schema:about ?work ;
                schema:name ?title ;
                schema:isPartOf <https://en.wikipedia.org/>.
        BIND(REPLACE(?title, " ", "_") AS ?slug)
    }

    # Get the form of creative work if it exists
    OPTIONAL {
        ?work wdt:P7937 ?form.
        ?form rdfs:label ?formLabel.
        FILTER(LANG(?formLabel) = "en")
    }
}
# Just keep the first publication date and form of creative work
GROUP BY ?work ?workLabel ?slug`;
