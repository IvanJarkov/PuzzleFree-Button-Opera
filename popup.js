async function getSettings() {
  const defaults = {
    openMode: "newtab", // newtab | currenttab
    defaultTarget: "home", // home | daily | all | categories | tags
    lastUrl: "",
  };
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaults, (data) => resolve(data));
  });
}

function targetToUrl(target) {
  switch (target) {
    case "daily":
      return "https://puzzlefree.game/pages/daily-jigsaw-puzzle-play-a-new-puzzle-every-day";
    case "all":
      return "https://puzzlefree.game/puzzles";
    case "categories":
      return "https://puzzlefree.game/puzzles/categories";
    case "tags":
      return "https://puzzlefree.game/puzzles/tags/";
    case "home":
    default:
      return "https://puzzlefree.game/";
  }
}

async function openUrl(url) {
  const s = await getSettings();
  const openMode = s.openMode || "newtab";
  if (openMode === "currenttab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (tab && tab.id) {
        chrome.tabs.update(tab.id, { url });
      } else {
        chrome.tabs.create({ url });
      }
    });
  } else {
    chrome.tabs.create({ url });
  }
  chrome.storage.sync.set({ lastUrl: url });
  window.close();
}

document.getElementById("openDefault").addEventListener("click", async () => {
  const s = await getSettings();
  openUrl(targetToUrl(s.defaultTarget));
});

document.getElementById("openDaily").addEventListener("click", () => openUrl(targetToUrl("daily")));
document.getElementById("openAll").addEventListener("click", () => openUrl(targetToUrl("all")));

document.getElementById("openLast").addEventListener("click", async () => {
  const s = await getSettings();
  const url = s.lastUrl || targetToUrl("home");
  openUrl(url);
});

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
  window.close();
});
