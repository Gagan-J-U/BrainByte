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
      blackoutDiv.style.opacity = "0"; // start invisible
      blackoutDiv.style.zIndex = "999999";
      blackoutDiv.style.transition = "opacity 1s ease"; // smoother transition
      blackoutDiv.style.pointerEvents = "none"; // ✅ allows nav interaction
      document.body.appendChild(blackoutDiv);

      // Trigger smooth fade-in after append
      requestAnimationFrame(() => {
        blackoutDiv.style.opacity = "0.9";
      });
    }
  }

  if (message.action === "stopBlackout") {
    if (blackoutDiv) {
      blackoutDiv.style.opacity = "0";
      setTimeout(() => {
        blackoutDiv.remove();
        blackoutDiv = null;
      }, 1000); // match the transition duration
    }
  }
});






