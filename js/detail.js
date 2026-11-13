const API_URL = "https://pokeapi.co/api/v2/pokemon";

const detailDiv = document.getElementById("detail");
const errorDiv = document.getElementById("error");

const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get("id");

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.hidden = false;
}

function createBackButton() {
  const button = document.createElement("button");
  button.className = "btn";
  button.textContent = "← Torna enrere";
  button.addEventListener("click", () => history.back());
  return button;
}

function createAbilitiesTable(abilities) {
  const table = document.createElement("table");
  table.className = "table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["ID", "Habilitat"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  abilities.forEach((a) => {
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    tdId.textContent = a.slot;
    const tdName = document.createElement("td");
    tdName.textContent = a.ability.name;
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function renderDetail(pokemon) {
  detailDiv.replaceChildren();

  const name = document.createElement("h2");
  name.className = "detail-name";
  name.textContent = pokemon.name;

  const img = document.createElement("img");
  img.className = "detail-img";
  img.src = pokemon.sprites.front_default;
  img.alt = pokemon.name;

  const info = document.createElement("div");
  info.className = "detail-info";
  info.textContent = `Pes: ${pokemon.weight} | Alçada: ${pokemon.height}`;

  detailDiv.appendChild(name);
  detailDiv.appendChild(img);
  detailDiv.appendChild(info);
  detailDiv.appendChild(createAbilitiesTable(pokemon.abilities));
  detailDiv.appendChild(createBackButton());
}

if (!pokemonId) {
  showError("Falta el paràmetre 'id' a la URL.");
  detailDiv.appendChild(createBackButton());
} else {
  fetch(`${API_URL}/${encodeURIComponent(pokemonId)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la petició. Codi: ${response.status}`);
      }
      return response.json();
    })
    .then((pokemon) => renderDetail(pokemon))
    .catch((error) => {
      console.error(error);
      showError(error.message || "S'ha produït un error inesperat.");
      detailDiv.appendChild(createBackButton());
    });
}