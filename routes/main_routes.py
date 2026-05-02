from flask import Blueprint, request, jsonify, render_template

from config import ENDPOINTS
from queries import PREDEFINED_QUERIES
from services.sparql_service import ejecutar_consulta_sparql


main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def index():
    return render_template(
        "index.html",
        endpoints=ENDPOINTS,
        queries=PREDEFINED_QUERIES
    )


@main_bp.route("/predefined-queries")
def predefined_queries():
    return jsonify(PREDEFINED_QUERIES)


@main_bp.route("/query", methods=["POST"])
def query():
    data = request.get_json()

    sparql_query = data.get("query", "")
    endpoint_url = data.get("endpoint", ENDPOINTS["DBpedia"])

    try:
        resultado = ejecutar_consulta_sparql(endpoint_url, sparql_query)
        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 200