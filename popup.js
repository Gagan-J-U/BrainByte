

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("quizTab").click();
});



// Tab switching
const quizTab = document.getElementById('quizTab');
const chatTab = document.getElementById('chatTab');
const quizView = document.getElementById('quizView');
const chatView = document.getElementById('chatView');
const themeToggle = document.getElementById('themeToggle');


let sessionPromise = null;

async function getSession() {
  // If session is already being created or exists, reuse it
  if (sessionPromise) return sessionPromise;

  sessionPromise = (async () => {
    const available = await LanguageModel.availability();
    if (available === "unavailable") {
      throw new Error("⚠️ LanguageModel API unavailable. Enable it in chrome://flags.");
    }

    const model = await LanguageModel.create({
  initialPrompts: [
    {
      role: "system",
      content: "You are an AI that can generate quizzes and chat with users. Keep answers clear, concise, and friendly."
    },
    {
      role: "user",
      content: "If the user selects text, generate a quiz. If they chat, respond normally."
    }
  ],
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
});


    console.log("✅ LanguageModel session ready!");
    return model;
  })();

  return sessionPromise;
}




quizTab.addEventListener('click', () => {
  quizTab.classList.add('active');
  chatTab.classList.remove('active');
  quizView.classList.add('active');
  chatView.classList.remove('active');
  
});

chatTab.addEventListener('click', () => {
  chatTab.classList.add('active');
  quizTab.classList.remove('active');
  chatView.classList.add('active');
  quizView.classList.remove('active');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');

  if (isLight) {
    themeToggle.innerHTML = `<svg class="moon-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>`;
  } else {
    themeToggle.innerHTML = `<svg class="sun-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>`;
  }
});

// Chat functionality
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');

function sendMessage() {

//chatbot

(async () => {
  // --- Check if Prompt API is available ---
  const available = await LanguageModel.availability();
  if (available === 'unavailable') {
    console.error("⚠ Prompt API not available. Make sure you're using Chrome 138+ and 'window.ai' is enabled in chrome://flags.");
    return;
  }

  // --- Wait for user interaction to allow model download ---
  if (!navigator.userActivation.isActive) {
    console.warn("⚠ Click somewhere on the page before running this code again. User activation required for model download.");
    return;
  }



  


  // --- Chat loop ---
  async function chat() {
    const Message =chatInput.value.trim();
  if (!Message) return;

  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const userMessage = `
    <div class="message" style="flex-direction: row-reverse; text-align: right;">
      <div>
        <div class="message-content" style="background: linear-gradient(90deg, #2f80ed, #56ccf2); margin-left: auto;">
          <div class="message-text">${Message}</div>
        </div>
        <div class="message-time">${time}</div>
      </div>
    </div>
  `;

  chatMessages.insertAdjacentHTML('beforeend', userMessage);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
    if (!Message) return;

    console.log("🤖 Chatbot is typing...");
    const session = await getSession();
    // Stream model response
    const stream =await session.prompt(Message);
    const aiResponse = `
      <div class="message">
        <div class="message-avatar">🤖</div>
        <div>
          <div class="message-content">
            <div class="message-text">"${stream}"</div>
          </div>
          <div class="message-time">${time}</div>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', aiResponse);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show token usage
    console.log(`\n📊 Session usage: ${session.inputUsage}/${session.inputQuota} tokens`);

    // Continue chat
    chat();
  }

  // --- Start chat ---
  chat();
})();
  // Simulate AI response (replace with actual API call)
  


}

chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Quiz functionality
document.getElementById('summarizeBtn').addEventListener('click', summarizeSelectedText);
document.getElementById('generateQuizBtn').addEventListener('click', generateQuizFromSelectedText);

async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, (response) => {
      resolve(response?.text?.trim() || "");
    });
  });
}

// --- Summarizer logic ---
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
      context: "Give the summary in simple and give html code in the form of unorder list with li tag in outer",
    });

    summaryDiv.outerHTML = summary;

  } catch (err) {
    console.error(err);
    summaryDiv.textContent = "❌ Error generating summary.";
  }
}

async function generateQuizFromSelectedText() {
  //change
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
chrome.tabs.sendMessage(tab.id, { action: "startBlackout" });
  const quizDiv = document.getElementById("result");
  quizDiv.textContent = "⏳ Generating quiz...";
  //change
  

  const selectedText = await getSelectedText();
  if (!selectedText) {
    quizDiv.textContent = "❌ Please select some text first!";
    //change
    chrome.tabs.sendMessage(tab.id, { action: "stopBlackout" });
    return;
    
  }

  if (!("LanguageModel" in window)) {
    quizDiv.textContent =
      "❌ Prompt API (LanguageModel) not available. Enable 'Prompt API' in chrome://flags.";
       chrome.tabs.sendMessage(tab.id, { action: "stopBlackout" });
    return;
  }

  try {
    const available = await LanguageModel.availability();
    if (available === "unavailable") {
      quizDiv.textContent = "⚠️ Model unavailable or still downloading. Try again later.";
      return;
    }

    const session = await getSession();
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

Generate a ${document.getElementById("difficulty").value} level multiple-choice quiz with ${document.getElementById("questions").value} questions based on the text below.

Text:
"""
${selectedText}
"""

Requirements:
- Each question should test key concepts from the text.
- Provide exactly 4 answer options per question.
- Randomly position the correct answer among the 4 options.
- Clearly mark the correct answer (e.g., "Correct answer: B" or similar).
- Keep the language concise and easy to understand.
- Do not include explanations unless asked.
- Format neatly for display.
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

    qDiv.classList.add("question-block");

    qDiv.innerHTML = `<p><b>Q${i + 1}.</b> ${q.question}</p>`;

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "option-btn";

      btn.addEventListener("click", () => {
        // prevent multiple answers
        const allBtns = qDiv.querySelectorAll("button");
        allBtns.forEach((b) => (b.disabled = true));
        btn.dataset.selected = "true";

        if (opt === q.answer) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
          allBtns.forEach((b) => {
            if (b.textContent === q.answer) b.classList.add("correct");
          });
        }
      });

      qDiv.appendChild(btn);
    });

    quizDiv.appendChild(qDiv);
    quizDiv.appendChild(document.createElement("hr"));
  });

 
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("action-btn")
  submitBtn.textContent = "Submit Quiz";
  
  submitBtn.style.marginTop = "20px";
  quizDiv.appendChild(submitBtn);

  // ✅ handle submit
  submitBtn.addEventListener("click", async () => {
    let correct = 0;
    let total = quiz.length;

    const questionBlocks = quizDiv.querySelectorAll(".question-block");
    questionBlocks.forEach((qBlock, idx) => {
      const selected = qBlock.querySelector("button[data-selected='true']");
      if (selected && selected.textContent === quiz[idx].answer) correct++;
    });

    quizDiv.innerHTML = `<h3>🎯 Quiz Completed!</h3>
      <p>You scored <b>${correct}</b> out of <b>${total}</b>.</p>`;

    // ✅ stop blackout
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { action: "stopBlackout" });
    } catch (err) {
      console.error("Could not stop blackout:", err);
    }
  });
}



