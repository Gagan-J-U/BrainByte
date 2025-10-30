chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeSelection",
    title: "Summarize Selected Text",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "quizSelection",
    title: "Generate Quiz from Selection",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarizeSelection") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: summarizeSelectedText,
    });
  } else if (info.menuItemId === "quizSelection") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: generateQuizFromSelectedText,
    });
  }
});

function summarizeSelectedText() {
  const text = window.getSelection().toString();
  chrome.runtime.sendMessage({ action: "summarize", text });
}

function generateQuizFromSelectedText() {
  const text = window.getSelection().toString();
  chrome.runtime.sendMessage({ action: "quiz", text });
}
