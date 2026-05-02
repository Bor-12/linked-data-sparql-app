from SPARQLWrapper import SPARQLWrapper, JSON


def ejecutar_consulta_sparql(endpoint_url, sparql_query):
    sparql = SPARQLWrapper(endpoint_url)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    sparql.setTimeout(20)

    results = sparql.query().convert()

    bindings = results.get("results", {}).get("bindings", [])
    headers = results.get("head", {}).get("vars", [])

    return {
        "headers": headers,
        "rows": bindings,
        "count": len(bindings)
    }