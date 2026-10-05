const D = window.MANGA_RADAR_DATA;

const radar = D.radar.filter(x => x.Titre);
const snap = D.snapshot.filter(x => x.Titre);

const $ = id => document.getElementById(id);

const score = x => Number(x["Score V6"] || 0);

const sorted = [...radar].sort((a, b) => score(b) - score(a));

$("topScore").textContent = score(sorted[0]);
$("topTitle").textContent = sorted[0].Titre;

const avg = Math.round(
  sorted.reduce((a, x) => a + score(x), 0) / sorted.length
);

const strong = sorted.filter(x => score(x) >= 85).length;

$("stats").innerHTML = [
  ["" + radar.length, "titres suivis"],
  ["" + strong, "scores ≥ 85"],
  ["" + avg, "score moyen"],
  ["06/09/2026", "snapshot S0"]
]
  .map(
    x =>
      `<div class="stat"><b>${x[0]}</b><small>${x[1]}</small></div>`
  )
  .join("");

const types = [
  ...new Set(snap.map(x => x.Type).filter(Boolean))
].sort();

$("filter").innerHTML =
  '<option value="">Tous les types</option>' +
  types.map(t => `<option>${t}</option>`).join("");

function renderRadar() {
  const q = $("search").value.toLowerCase();

  const arr = sorted.filter(
    x =>
      !q ||
      JSON.stringify(x).toLowerCase().includes(q)
  );

  $("radar").innerHTML =
    '<div class="row head">' +
    "<div>#</div>" +
    "<div>Titre</div>" +
    "<div>Score</div>" +
    "<div>Signal</div>" +
    "<div>Action</div>" +
    "</div>" +
    arr
      .map(
        (x, i) =>
          `<div class="row">
            <div class="muted">${i + 1}</div>
            <div>
              <div class="title">${x.Titre}</div>
              <div class="bar">
                <i style="width:${score(x)}%"></i>
              </div>
            </div>
            <div class="score">${score(x)}</div>
            <div class="muted">${x["Signal dominant"] || ""}</div>
            <div>
              <span class="pill">${x.Action || ""}</span>
            </div>
          </div>`
      )
      .join("") ||
    "<p>Aucun résultat.</p>";
}

function renderSnap() {
  const f = $("filter").value;

  const arr = snap
    .filter(x => !f || x.Type === f)
    .sort((a, b) => score(b) - score(a));

  $("snapshot").innerHTML =
    '<div class="row head">' +
    "<div></div>" +
    "<div>Titre</div>" +
    "<div>Score</div>" +
    "<div>Sortie</div>" +
    "<div>Éditeur</div>" +
    "</div>" +
    arr
      .map(
        x =>
          `<div class="row">
            <div></div>
            <div>
              <div class="title">${x.Titre}</div>
              <div class="muted">
                ${x.Type || ""} · Tome ${x.Tome || "—"}
              </div>
            </div>
            <div class="score">${score(x)}</div>
            <div class="muted">${x["Date sortie"] || "—"}</div>
            <div class="muted">${x.Éditeur || "—"}</div>
          </div>`
      )
      .join("");
}

$("sources").innerHTML = D.sources
  .filter(x => x.Source)
  .map(
    x =>
      `<div class="source">
        <a href="${x.URL}" target="_blank" rel="noopener">
          ${x.Source}
        </a>
        <span>${x.Usage || ""}</span>
      </div>`
  )
  .join("");

$("search").addEventListener("input", renderRadar);
$("filter").addEventListener("change", renderSnap);

renderRadar();
renderSnap();
