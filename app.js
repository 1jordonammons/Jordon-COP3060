console.log("PA02 JS (Part 2) loaded. Welcome, Jordon!");
console.log("Repo URL: https://github.com/1jordonammons/Jordon-COP3060");

const studentName = "Jordon Ammons";
const age = 20;
const isEnrolled = true;
const tips = ["Use const", "Use ===", "Test errors", "Comment logic", "Commit often"];
const profile = { major: "CS", year: "Junior" };
let middleName = null;
let futureValue;

const completed = 3 + 2;
const isAdult = age >= 18;
const sameName = (studentName === "Jordon Ammons");
const canRegister = isEnrolled && isAdult;

const form = document.getElementById("whoForm");
const emailInput = document.getElementById("email");
const statusBox = document.getElementById("status");

const localList = document.getElementById("localList");

const loadBtn = document.getElementById("loadBtn");
const fetchStatus = document.getElementById("fetchStatus");
const results = document.getElementById("results");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const browserSelect = document.getElementById("browser");
const likeYes = document.getElementById("yes");
const likeNo = document.getElementById("no");

const appState = {
  rawData: [],
  viewData: []
};

function esc(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildUrl({ limit = 20 } = {}) {
  return `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
}

function setFetchStatus(msg) {
  fetchStatus.textContent = msg || "";
}

function handleError(msg) {
  setFetchStatus(msg);
  results.innerHTML = "";
}

function renderLocalList(items) {
  localList.innerHTML = "";
  for (const item of items.slice(0, 5)) {
    const li = document.createElement("li");
    li.textContent = item;
    localList.appendChild(li);
  }
}

function renderResults(items) {
  results.innerHTML = "";
  if (!items || items.length === 0) {
    results.innerHTML = `<li>No results found.</li>`;
    return;
  }
  const toRender = items.slice(0, Math.max(10, items.length));
  for (const post of toRender) {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <article>
        <h4>${esc(post.title)}</h4>
        <p>${esc(post.body)}</p>
        <small>Post #${post.id}</small>
      </article>
    `;
    results.appendChild(li);
  }
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function filterAndSortData(data, query, sortMode) {
  let out = Array.isArray(data) ? [...data] : [];
  const q = (query || "").trim().toLowerCase();

  if (q) {
    out = out.filter(item => String(item.title).toLowerCase().includes(q));
  }
  if (sortMode === "az") {
    out.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  } else if (sortMode === "za") {
    out.sort((a, b) => String(b.title).localeCompare(String(a.title)));
  }
  return out;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;
  if (validateEmail(email)) {
    statusBox.textContent = "✅ Email looks good!";
    statusBox.style.color = "green";
  } else {
    statusBox.textContent = "❌ Please enter a valid email (e.g., you@school.edu).";
    statusBox.style.color = "crimson";
  }
});

browserSelect?.addEventListener("change", () => {
  const pick = browserSelect.value;
  statusBox.textContent = pick === "safari"
    ? "🍎 Safari user—clean."
    : `You chose ${pick}.`;
  statusBox.style.color = "";
});

[likeYes, likeNo].forEach(el => {
  el?.addEventListener("click", () => {
    if (likeYes.checked) {
      statusBox.textContent = "Appreciate you. 🙌";
    } else if (likeNo.checked) {
      statusBox.textContent = "I'll keep improving. 💪";
    }
    statusBox.style.color = "";
  });
});

loadBtn.addEventListener("click", async () => {
  try {
    setFetchStatus("Loading…");
    results.innerHTML = "";

    const url = buildUrl({ limit: 20 });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const json = await res.json();
    if (!Array.isArray(json)) throw new Error("Unexpected response format.");

    appState.rawData = json;
    appState.viewData = filterAndSortData(appState.rawData, searchInput.value, sortSelect.value);

    if (appState.viewData.length === 0) {
      setFetchStatus("No data returned.");
      results.innerHTML = `<li>No results found.</li>`;
      return;
    }

    renderResults(appState.viewData);
    setFetchStatus("");
  } catch (err) {
    console.error(err);
    handleError("We hit an error loading data. Please try again or check your connection.");
  }
});

searchInput.addEventListener("input", () => {
  appState.viewData = filterAndSortData(appState.rawData, searchInput.value, sortSelect.value);
  renderResults(appState.viewData);
});

sortSelect.addEventListener("change", () => {
  appState.viewData = filterAndSortData(appState.rawData, searchInput.value, sortSelect.value);
  renderResults(appState.viewData);
});

renderLocalList(tips);
