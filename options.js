const defaults = {
  openMode: "newtab",
  defaultTarget: "home",
  lastUrl: ""
};

function save(data) {
  return new Promise((resolve) => chrome.storage.sync.set(data, resolve));
}
function load() {
  return new Promise((resolve) => chrome.storage.sync.get(defaults, resolve));
}

async function init() {
  const s = await load();
  document.getElementById("defaultTarget").value = s.defaultTarget;
  document.getElementById("openMode").value = s.openMode;

  const status = document.getElementById("status");
  function showSaved() {
    status.textContent = "Saved ✓";
    status.className = "note ok";
    setTimeout(() => { status.textContent = ""; status.className = "note"; }, 1200);
  }

  document.getElementById("defaultTarget").addEventListener("change", async (e) => {
    await save({ defaultTarget: e.target.value });
    showSaved();
  });

  document.getElementById("openMode").addEventListener("change", async (e) => {
    await save({ openMode: e.target.value });
    showSaved();
  });
}
init();
