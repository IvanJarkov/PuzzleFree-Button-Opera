const MENU_ID = "puzzlefree_open";

const DEFAULTS = {
  openMode: "newtab", // newtab | currenttab
  defaultTarget: "home", // home | daily | all | categories | tags
  lastUrl: ""
};

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

function openUrl(url) {
  chrome.storage.sync.set({ lastUrl: url });

  chrome.storage.sync.get(DEFAULTS, (s) => {
    const openMode = s.openMode || "newtab";
    if (openMode === "currenttab") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0];
        if (tab && tab.id) chrome.tabs.update(tab.id, { url });
        else chrome.tabs.create({ url });
      });
    } else {
      chrome.tabs.create({ url });
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(DEFAULTS, (s) => {
    // ensure defaults exist
    chrome.storage.sync.set({
      openMode: s.openMode || DEFAULTS.openMode,
      defaultTarget: s.defaultTarget || DEFAULTS.defaultTarget,
      lastUrl: s.lastUrl || ""
    });
  });

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Open PuzzleFree.Game",
      contexts: ["all"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) return;
  chrome.storage.sync.get(DEFAULTS, (s) => {
    const url = targetToUrl(s.defaultTarget);
    openUrl(url);
  });
});
