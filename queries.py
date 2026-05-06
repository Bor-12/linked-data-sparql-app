PREDEFINED_QUERIES = {
    "DBpedia - Filósofos griegos": {
        "endpoint": "DBpedia",
        "query": """PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX dbc: <http://dbpedia.org/resource/Category:>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT DISTINCT ?nombre
    WHERE {
        ?persona dct:subject dbc:Ancient_Greek_philosophers .
    
        OPTIONAL {
            ?persona rdfs:label ?nombreEs .
            FILTER (lang(?nombreEs) = "es")
        }
    
        OPTIONAL {
            ?persona rdfs:label ?nombreEn .
            FILTER (lang(?nombreEn) = "en")
        }
    
        BIND(COALESCE(?nombreEs, ?nombreEn) AS ?nombre)
    }
    ORDER BY ?nombre
    LIMIT 15"""
    },

    "DBpedia - Países con más superficie": {
        "endpoint": "DBpedia",
        "query": """PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?nombre ?area
WHERE {
    ?pais a dbo:Country .
    ?pais rdfs:label ?nombre .
    ?pais dbo:areaTotal ?area .
    FILTER (lang(?nombre) = "es")
}
ORDER BY DESC(?area)
LIMIT 20"""
    },

    "Wikidata - Países y capitales": {
        "endpoint": "Wikidata",
        "query": """SELECT ?pais ?paisLabel ?capitalLabel
WHERE {
    ?pais wdt:P31 wd:Q6256 .
    OPTIONAL { ?pais wdt:P36 ?capital . }

    SERVICE wikibase:label {
        bd:serviceParam wikibase:language "es,en" .
    }
}
LIMIT 10"""
    },

    "Europeana - Proveedores de datos": {
        "endpoint": "Europeana",
        "query": """PREFIX edm: <http://www.europeana.eu/schemas/edm/>

SELECT ?DataProvider
WHERE {
    ?Aggregation edm:dataProvider ?DataProvider .
}
LIMIT 20"""
    },
}