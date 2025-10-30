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





//floater

let aiButton;

// Create floating button
function createFloatingButton() {
  aiButton = document.createElement("button");
  aiButton.textContent = "⚡ AI";
  aiButton.id = "ai-float-btn";
  aiButton.style.position = "absolute";
  aiButton.style.zIndex = "999999";
  aiButton.style.background = "#ff7a00";
  aiButton.style.color = "#fff";
  aiButton.style.border = "none";
  aiButton.style.borderRadius = "20px";
  aiButton.style.padding = "6px 10px";
  aiButton.style.fontSize = "12px";
  aiButton.style.cursor = "pointer";
  aiButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  aiButton.style.transition = "opacity 0.2s ease";
  aiButton.style.opacity = "0";
  aiButton.style.pointerEvents = "none";

  document.body.appendChild(aiButton);

  aiButton.addEventListener("click", async () => {
    const text = window.getSelection().toString().trim();
    if (!text) return;

    const encoded = encodeURIComponent(text);
    chrome.runtime.sendMessage({
      action: "openPopup",
      text: encoded
    });

    aiButton.style.opacity = "0";
  });
}

createFloatingButton();

// Detect text selection
document.addEventListener("mouseup", (e) => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText.length > 0) {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    aiButton.style.top = `${window.scrollY + rect.top - 30}px`;
    aiButton.style.left = `${window.scrollX + rect.right}px`;
    aiButton.style.opacity = "1";
    aiButton.style.pointerEvents = "auto";
  } else {
    aiButton.style.opacity = "0";
    aiButton.style.pointerEvents = "none";
  }
});