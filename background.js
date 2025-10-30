chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize selected text",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "generateQuiz",
    title: "Generate Quiz from text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarizeText" || info.menuItemId === "generateQuiz") {
    const encodedText = encodeURIComponent(info.selectionText || "");
    const action = info.menuItemId;

    chrome.windows.create({
      url: chrome.runtime.getURL(`popup.html?action=${action}&text=${encodedText}`),
      type: "popup",
      width: 400,
      height: 600,
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "openPopup") {
    chrome.windows.create({
      url: chrome.runtime.getURL(`popup.html?text=${msg.text}`),
      type: "popup",
      width: 400,
      height: 600
    });
  }
});
