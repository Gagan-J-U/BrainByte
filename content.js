chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
});
// Add blackout overlay
// function addBlackout() {
//   if (document.getElementById("blackout-overlay")) return;

//   const overlay = document.createElement("div");
//   overlay.id = "blackout-overlay";
//   overlay.style.position = "fixed";
//   overlay.style.top = 0;
//   overlay.style.left = 0;
//   overlay.style.width = "100vw";
//   overlay.style.height = "100vh";
//   overlay.style.background = "black";
//   overlay.style.zIndex = 999999;
//   overlay.style.pointerEvents = "none";
//   overlay.style.transition = "opacity 0.5s ease";
//   overlay.style.opacity = "1";

//   document.body.appendChild(overlay);
// }

// Remove blackout overlay
// function removeBlackout() {
//   const overlay = document.getElementById("blackout-overlay");
//   if (overlay) overlay.remove();
// }

// // Listen for messages from popup.js
// chrome.runtime.onMessage.addListener((request) => {
//   if (request.action === "addBlackout") addBlackout();
//   if (request.action === "removeBlackout") removeBlackout();
// });
