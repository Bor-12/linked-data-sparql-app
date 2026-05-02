"""
SPARQL Explorer — Linked Data Application
Requiere: pip install flask sparqlwrapper
Ejecutar: python app.py
"""

from flask import Flask
import webbrowser
import threading
import time
import logging
import flask.cli

from routes.main_routes import main_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(main_bp)
    return app


def open_browser():
    time.sleep(1.2)
    webbrowser.open("http://localhost:5000")


if __name__ == "__main__":
    app = create_app()

    # Oculta el banner/logs internos de Flask/Werkzeug
    flask.cli.show_server_banner = lambda *args, **kwargs: None
    logging.getLogger("werkzeug").setLevel(logging.ERROR)

    print("=" * 55)
    print("  SPARQL Explorer — Linked Data Application")
    print("=" * 55)
    print("  Abriendo navegador en http://localhost:5000 ...")
    print("  Pulsa Ctrl+C para detener el servidor.")
    print("=" * 55)

    threading.Thread(target=open_browser, daemon=True).start()
    app.run(debug=False, port=5000)