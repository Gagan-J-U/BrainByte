chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
});

let blackoutDiv;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startBlackout") {
    if (!blackoutDiv) {
      blackoutDiv = document.createElement("div");
      blackoutDiv.id = "blackout-overlay";
      blackoutDiv.style.position = "fixed";
      blackoutDiv.style.top = 0;
      blackoutDiv.style.left = 0;
      blackoutDiv.style.width = "100vw";
      blackoutDiv.style.height = "100vh";
      blackoutDiv.style.backgroundColor = "black";
      blackoutDiv.style.opacity = "0.9";
      blackoutDiv.style.zIndex = "999999";
      blackoutDiv.style.transition = "opacity 0.5s ease";
      blackoutDiv.style.pointerEvents = "none"; // ✅ allows nav interaction even when blacked out
      document.body.appendChild(blackoutDiv);
    }
  }

  if (message.action === "stopBlackout") {
    if (blackoutDiv) {
      blackoutDiv.style.opacity = "0";
      setTimeout(() => {
        blackoutDiv.remove();
        blackoutDiv = null;
      }, 500); // smooth fade-out
    }
  }
});





