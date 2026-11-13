const API_URL = "https://pokeapi.co/api/v2/pokemon";
const SPRITE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const OPTIONS = [10, 20, 30];

// Estat inicial: es recupera de la URL perquè en tornar enrere de detail.html es conservi la pàgina
const params = new URLSearchParams(window.location.search);
let limit = OPTIONS.includes(Number(params.get("limit"))) ? Number(params.get("limit")) : 10;
let offset = Math.max(0, Number(params.get("offset")) || 0);

const controlsDiv = document.getElementById("controls");
const cardsDiv = document.getElementById("cards");
const paginationDiv = document.getElementById("pagination");
const errorDiv = document.getElementById("error");

let prevBtn, nextBtn;

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.hidden = false;
}

function clearError() {
  errorDiv.hidden = true;
  errorDiv.textContent = "";
}

// ---------- Selector de nombre de resultats ----------
function buildSelector() {
  const label = document.createElement("label");
  label.setAttribute("for", "limit-select");
  label.textContent = "Numero de resultats";

  const select = document.createElement("select");
  select.id = "limit-select";
  OPTIONS.forEach((n) => {
    const option = document.createElement("option");
    option.value = n;
    option.textContent = n;
    if (n === limit) option.selected = true;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    limit = Number(select.value);
    offset = 0;
    loadPokemons();
  });

  controlsDiv.appendChild(label);
  controlsDiv.appendChild(select);
}

// ---------- Paginació ----------
function buildPagination() {
  prevBtn = document.createElement("button");
  prevBtn.className = "btn";
  prevBtn.textContent = "Prev";
  prevBtn.addEventListener("click", () => {
    offset = Math.max(0, offset - limit);
    loadPokemons();
  });

  nextBtn = document.createElement("button");
  nextBtn.className = "btn";
  nextBtn.textContent = "Next";
  nextBtn.addEventListener("click", () => {
    offset += limit;
    loadPokemons();
  });

  paginationDiv.appendChild(prevBtn);
  paginationDiv.appendChild(nextBtn);
}

// ---------- Cards ----------
function getIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function createCard(pokemon) {
  const id = getIdFromUrl(pokemon.url);

  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.className = "card-img";
  img.src = `${SPRITE_URL}${id}.png`;
  img.alt = pokemon.name;

  const name = document.createElement("div");
  name.className = "card-name";
  name.textContent = pokemon.name;

  const button = document.createElement("button");
  button.className = "btn";
  button.textContent = "Detall";
  button.addEventListener("click", () => {
    location.href = `detail.html?id=${id}`;
  });

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(button);
  return card;
}

function renderCards(pokemons) {
  cardsDiv.replaceChildren();
  pokemons.forEach((p) => cardsDiv.appendChild(createCard(p)));
}

// ---------- Càrrega de dades ----------
function loadPokemons() {
  clearError();
  // Guardem l'estat a la URL sense recarregar la pàgina
  history.replaceState(null, "", `?limit=${limit}&offset=${offset}`);

  fetch(`${API_URL}?limit=${limit}&offset=${offset}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la petició. Codi: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderCards(data.results);
      prevBtn.disabled = data.previous === null;
      nextBtn.disabled = data.next === null;
    })
    .catch((error) => {
      console.error(error);
      showError(error.message || "S'ha produït un error inesperat.");
    });
}

buildSelector();
buildPagination();
loadPokemons();