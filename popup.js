

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("quizTab").click();
});



// Tab switching
const quizTab = document.getElementById('quizTab');
const chatTab = document.getElementById('chatTab');
const quizView = document.getElementById('quizView');
const chatView = document.getElementById('chatView');
const themeToggle = document.getElementById('themeToggle');

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
  const message = chatInput.value.trim();
  if (!message) return;

  const time = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const userMessage = `
    <div class="message" style="flex-direction: row-reverse; text-align: right;">
      <div>
        <div class="message-content" style="background: linear-gradient(90deg, #2f80ed, #56ccf2); margin-left: auto;">
          <div class="message-text">${message}</div>
        </div>
        <div class="message-time">${time}</div>
      </div>
    </div>
  `;

  chatMessages.insertAdjacentHTML('beforeend', userMessage);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Simulate AI response (replace with actual API call)
  setTimeout(() => {
    const aiResponse = `
      <div class="message">
        <div class="message-avatar">🤖</div>
        <div>
          <div class="message-content">
            <div class="message-text">I received your message: "${message}". This is where the AI response would appear!</div>
          </div>
          <div class="message-time">${time}</div>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', aiResponse);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
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
      Create a short multiple-choice quiz (${document.getElementById("questions")} questions) from this text with a difficulty of ${document.getElementById("difficulty").value}.:
      """${selectedText}"""
      Make sure the answer to the questions are randomly placed among the options .
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

  // ✅ Add submit button
  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("class","generate-btn")
  submitBtn.textContent = "Submit Quiz";
  submitBtn.className = "submit-btn";
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


//hi






