# SPARQL Explorer — Linked Data Application

Aplicación web desarrollada con **Python y Flask** para consultar datos enlazados mediante **SPARQL**.

Permite ejecutar consultas sobre distintos endpoints Linked Data, como **DBpedia**, **Wikidata** y **Europeana**, mostrando los resultados en una tabla dentro de la propia web.

---

## Requisitos

- Python 3.8 o superior
- pip

---

## Instalación

Primero se instalan las dependencias del proyecto:

```bash
  pip install -r requirements.txt
```

## Ejecución

Para ejecutar la aplicación, hay que situarse en la carpeta principal del proyecto y ejecutar:

```bash
  python app.py
```

La aplicación se abrirá automáticamente en el navegador.

Si no se abre automáticamente, se puede acceder manualmente desde:

```text
http://localhost:5000
```

## Funcionalidades

La aplicación permite:

- Seleccionar distintos endpoints SPARQL.
- Escribir consultas SPARQL manualmente.
- Ejecutar consultas predefinidas.
- Visualizar los resultados en una tabla.
- Mostrar URIs como enlaces clicables.
- Ver estadísticas de la consulta:
  - número de resultados,
  - tiempo de respuesta,
  - número de columnas.
- Exportar los resultados en formato CSV.

## Endpoints utilizados

- DBpedia
- Wikidata
- Europeana

## Consultas predefinidas

La aplicación incluye consultas de ejemplo como:

- Filósofos griegos en DBpedia.
- Países con más superficie en DBpedia.
- Países y capitales en Wikidata.
- Proveedores de datos en Europeana.
