let PREDEFINED = {};
let lastData = [];
let lastHeaders = [];

document.addEventListener("DOMContentLoaded", async () => {
  await cargarConsultasPredefinidas();

  document.querySelectorAll(".query-btn").forEach(button => {
    button.addEventListener("click", () => {
      const nombreConsulta = button.dataset.queryName;
      loadQuery(nombreConsulta);
    });
  });

  document.getElementById("queryInput").addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      runQuery();
    }
  });
  document.getElementById("queryInput").addEventListener("input", actualizarBotonLimpiar);

  actualizarBotonLimpiar();

  document.getElementById("endpointSelect").addEventListener("change", function () {
    document.getElementById("endpointUrl").textContent = this.value;
  });
});



async function cargarConsultasPredefinidas() {
  try {
    const response = await fetch("/predefined-queries");
    PREDEFINED = await response.json();
    console.log("Consultas cargadas:", PREDEFINED);
  } catch (error) {
    console.error("Error cargando consultas predefinidas:", error);
  }
}

function actualizarBotonLimpiar() {
  const textarea = document.getElementById("queryInput");
  const botonLimpiar = document.querySelector(".btn-clear");

  if (textarea.value.trim() !== "") {
    botonLimpiar.classList.add("activo");
  } else {
    botonLimpiar.classList.remove("activo");
  }
}
function loadQuery(name) {
  const q = PREDEFINED[name];

  if (!q) {
    console.error("Consulta no encontrada:", name);
    return;
  }

  document.getElementById("queryInput").value = q.query;

  const selector = document.getElementById("endpointSelect");

  for (let option of selector.options) {
    if (option.textContent.trim() === q.endpoint) {
      selector.value = option.value;
      document.getElementById("endpointUrl").textContent = option.value;
      break;
    }
  }
  actualizarBotonLimpiar();
}

async function runQuery() {
  const query = document.getElementById("queryInput").value.trim();

  if (!query) {
    return;
  }

  const endpoint = document.getElementById("endpointSelect").value;
  const button = document.getElementById("btnRun");

  button.disabled = true;
  button.textContent = "⏳ Ejecutando...";

  showLoading();

  const startTime = Date.now();

  try {
    const response = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        endpoint: endpoint
      })
    });

    const data = await response.json();
    const elapsed = Date.now() - startTime;

    if (data.error) {
      showError(data.error);
      document.getElementById("statResults").textContent = "—";
      document.getElementById("statTime").textContent = elapsed;
      document.getElementById("statCols").textContent = "—";
    } else {
      showResults(data.headers, data.rows, elapsed);
      document.getElementById("statResults").textContent = data.rows.length;
      document.getElementById("statTime").textContent = elapsed;
      document.getElementById("statCols").textContent = data.headers.length;
    }

  } catch (error) {
    showError("Error de red: " + error.message);

  } finally {
    button.disabled = false;
    button.textContent = "▶ Ejecutar";
  }
}

function showLoading() {
  document.getElementById("resultCount").style.display = "none";
  document.getElementById("btnExport").style.display = "none";
  document.getElementById("timeBadge").textContent = "";

  document.getElementById("resultsBody").innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <div class="loading-text">Consultando endpoint SPARQL...</div>
    </div>
  `;
}

function showError(message) {
  document.getElementById("resultCount").style.display = "none";
  document.getElementById("btnExport").style.display = "none";

  document.getElementById("resultsBody").innerHTML = `
    <div class="error-box fade-in">⚠ ${message}</div>
  `;

  lastData = [];
  lastHeaders = [];
}

function isNumber(value) {
  return !isNaN(value) && value.trim() !== "";
}
function formatCell(value, type) {
  if (type === "uri") {
    return `
      <td class="cell-uri">
        <a href="${value}" target="_blank" title="${value}">
          ${value}
        </a>
      </td>
    `;
  }

  if (type === "literal" && isNumber(value)) {
    return `<td class="cell-num">${Number(value).toLocaleString("es-ES")}</td>`;
  }

  return `<td>${value}</td>`;
}

function showResults(headers, rows, elapsed) {
  lastHeaders = headers;
  lastData = rows;

  document.getElementById("timeBadge").textContent = elapsed + " ms";
  document.getElementById("resultCount").textContent =
    rows.length + (rows.length === 1 ? " fila" : " filas");

  document.getElementById("resultCount").style.display = "inline";
  document.getElementById("btnExport").style.display = "inline";

  if (rows.length === 0) {
    document.getElementById("resultsBody").innerHTML = `
      <div class="placeholder fade-in">
        <div class="placeholder-icon">◌</div>
        <div class="placeholder-text">La consulta no devolvió resultados</div>
      </div>
    `;
    return;
  }

  let html = `
    <table class="results-table fade-in">
      <thead>
        <tr>
          <th style="width:40px; color:var(--border)">#</th>
          ${headers.map(header => `<th>${header}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((row, index) => {
    html += `<tr><td class="row-num">${index + 1}</td>`;

    headers.forEach(header => {
      const cell = row[header] || {};
      const value = cell.value || "";
      const type = cell.type || "literal";

      html += formatCell(value, type);
    });

    html += "</tr>";
  });

  html += `
      </tbody>
    </table>
  `;

  document.getElementById("resultsBody").innerHTML = html;
}

function clearQuery() {
  document.getElementById("queryInput").value = "";
  document.getElementById("queryInput").focus();
  actualizarBotonLimpiar();
}

function exportCSV() {
  if (!lastData.length) {
    return;
  }

  const header = lastHeaders.join(",");

  const rows = lastData.map(row =>
    lastHeaders.map(header => {
      const value = row[header] && row[header].value ? row[header].value : "";
      return '"' + value.replace(/"/g, '""') + '"';
    }).join(",")
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sparql_results.csv";
  link.click();
}