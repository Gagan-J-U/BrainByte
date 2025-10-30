



document.getElementById("quiz").addEventListener("click",generateQuizFromSelectedText);


// document.getElementById("quiz").addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//   // Tell content.js to make the tab black
//   chrome.tabs.sendMessage(tab.id, { action: "addBlackout" });

//   // Start a timer for 10 seconds (for example)
//   startTimer(document.getElementById('timer').values, tab.id);
// });

// function startTimer(seconds, tabId) {
//   clearInterval(countdownInterval);
//   let remaining = seconds;
//   const countdownDisplay = document.getElementById("countdown");
//   const status = document.getElementById("status");

//   countdownDisplay.textContent = `⏱️ Time Left: ${remaining}s`;

//   countdownInterval = setInterval(() => {
//     remaining--;
//     countdownDisplay.textContent = `⏱️ Time Left: ${remaining}s`;

//     if (remaining <= 0) {
//       clearInterval(countdownInterval);
//       countdownDisplay.textContent = "⏰ Time's up!";
//       status.style.color = "#ff6b6b";
//       status.textContent = "Quiz session ended.";

//       // Remove blackout when timer finishes
//       chrome.tabs.sendMessage(tabId, { action: "removeBlackout" });
//     }
//   }, 1000);
// }

document.getElementById("summarizeBtn").addEventListener("click", summarizeSelectedText);

async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, (response) => {
      resolve(response?.text?.trim() || "");
    });
  });
}

// --- Summarizer logic (same as before) ---
async function summarizeSelectedText() {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.textContent = "⏳ Summarizing selected text...";

  const selectedText = await getSelectedText();
  if (!selectedText) {
    summaryDiv.textContent = "❌ Please select some text first!";
    return;
  }

  if (!("Summarizer" in window)) {
    summaryDiv.textContent =
      "❌ Summarizer API not available. Enable experimental AI features in Chrome flags.";
    return;
  }

  try {
    const summarizer = await Summarizer.create({
      sharedContext: "Summarize user-selected text for clarity.",
      type: "key-points",
      format: "markdown",
      length: "medium",
    });

    const summary = await summarizer.summarize(selectedText, {
      context: "Give the summary in simple and give html code in the form of unorder list with li tage in outer",
    });

    summaryDiv.outerHTML = summary;
    
  } catch (err) {
    console.error(err);
    summaryDiv.textContent = "❌ Error generating summary.";
  }
}







 
async function generateQuizFromSelectedText() {
  const quizDiv = document.getElementById("result");
  quizDiv.textContent = "⏳ Generating quiz...";

  const selectedText = await getSelectedText();
  if (!selectedText) {
    quizDiv.textContent = "❌ Please select some text first!";
    return;
  }

  if (!("LanguageModel" in window)) {
    quizDiv.textContent =
      "❌ Prompt API (LanguageModel) not available. Enable 'Prompt API' in chrome://flags.";
    return;
  }

  try {
    const available = await LanguageModel.availability();
    if (available === "unavailable") {
      quizDiv.textContent = "⚠️ Model unavailable or still downloading. Try again later.";
      return;
    }

    const session = await LanguageModel.create({
      initialPrompts: [
        {
          role: "system",
          content:
            "You generate MCQ quizzes from given text. Each question has 4 options and 1 correct answer.",
        },
      ],
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: ["en"] }],
    });

    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "string" },
        },
        required: ["question", "options", "answer"],
      },
    };

    const prompt = `
      Create a short multiple-choice quiz (3 questions) from this text:
      """${selectedText}"""
    `;

    const response = await session.prompt(prompt, {
      responseConstraint: schema,
    });

    // ✅ New API returns structured JSON text
    const quiz = JSON.parse(response);

    renderQuiz(quiz, quizDiv);
  } catch (err) {
    console.error(err);
    quizDiv.textContent = `❌ Error generating quiz: ${err.message}`;
  }
}

/* ----------------------------- QUIZ RENDERING ----------------------------- */
function renderQuiz(quiz, quizDiv) {
  quizDiv.innerHTML = "";

  quiz.forEach((q, i) => {
    const qDiv = document.createElement("div");
    qDiv.innerHTML = `<p><b>Q${i + 1}.</b> ${q.question}</p>`;

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "option-btn";

      btn.onclick = () => {
        const allBtns = qDiv.querySelectorAll("button");
        allBtns.forEach((b) => (b.disabled = true));

        if (opt === q.answer) {
          btn.style.background = "green";
        } else {
          btn.style.background = "red";
          allBtns.forEach((b) => {
            if (b.textContent === q.answer) b.style.background = "green";
          });
        }
      };

      qDiv.appendChild(btn);
    });

    quizDiv.appendChild(qDiv);
    quizDiv.appendChild(document.createElement("hr"));
  });
}
