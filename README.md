# 🧠 QuiSum — Smart Summarize + Quiz  
> ✨ *Learn faster, retain better — directly from any webpage.*

![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-orange?style=flat-square)
![Built For](https://img.shields.io/badge/Built%20For-Google%20Hackathon-blue?style=flat-square)
![AI Powered](https://img.shields.io/badge/Powered%20By-Chrome%20AI%20(Prompt%20%26%20Summarizer)-green?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

---

## 📘 Overview
**QuiSum** is a smart Chrome extension that transforms your reading experience by instantly turning any selected text into:
- 🪄 a **concise AI-generated summary**, or  
- 🧩 an **interactive multiple-choice quiz**,  
- 💬 or even a **chat-based learning session** powered by Chrome’s built-in AI.

It helps students, researchers, and curious minds **learn actively** instead of passively consuming content — all *within the same tab*.

---

## 🎯 Quick Pitch
> “What if you could summarize, quiz, or chat with any paragraph using just one click?”

That’s **QuiSum** — a minimal, orange-themed, AI-powered Chrome extension that:
- Extracts meaning using Chrome’s **Summarizer API**
- Generates quiz questions using **Prompt API**
- Opens a **chat mode** for deeper learning  
- Adds a **floating AI button** right next to your selected text 🟠  
- Dims your screen automatically during quizzes for laser-focus 🌑  
- And works perfectly via **right-click → “Summarize / Quizify”**

---

## 🧩 Demo / Screenshots

| Action | Preview |
|--------|----------|
| 🟠 Select text → Floating “AI” button appears near selection | ![Floating Button Demo](demo/floating-button.gif) |
| ⚡ Click “Summarize” → instant summary in popup | ![Summarizer Demo](demo/summarize.gif) |
| 💬 Switch to Chat tab → ask context-aware questions | ![Chat Mode Demo](demo/chat.gif) |
| 🧠 Click “Generate Quiz” → interactive quiz overlay | ![Quiz Demo](demo/quiz-darkmode.gif) |
| 🌑 Auto-dim screen during quiz for distraction-free learning | ![Dark Quiz Overlay](demo/dark-mode.png) |

*(Replace demo GIFs/screenshots once available.)*

---

## 🚀 Why QuiSum?

| Problem | Solution |
|----------|-----------|
| Reading long articles is time-consuming | One-click summarization powered by Chrome AI |
| Passive learning = poor retention | Turn any text into an engaging quiz instantly |
| Hard to stay focused while testing knowledge | Auto-dim screen during quiz for better concentration |
| Need quick access | Floating “⚡AI” icon appears instantly when text is selected |
| Prefer traditional menu actions | Also works with **right-click → Summarize / Quizify** |
| Want deeper understanding | Switch to the **Chat tab** for AI-driven explanations |

---

## 💡 Key Features

✅ **Instant Summaries** – Condense any selected text into key bullet points  
✅ **AI-Generated Quizzes** – Interactive MCQs with randomized correct options  
✅ **Floating AI Button** – Appears near selected text for quick actions  
✅ **Context Menu Integration** – Right-click → Summarize / Quizify  
✅ **Chat Mode** – Conversational learning experience inside popup  
✅ **Screen Dimming Mode** – Dark overlay activates during quiz for full focus  
✅ **Material Design UI** – Clean orange-accented layout (Google Material 3)  
✅ **Privacy-First** – No data tracking, all AI runs locally in Chrome  
✅ **Offline Ready** – Works with **Gemini Nano** (Chrome’s local AI model)

---

## 🧭 How It Works

1. **Select any text** on a webpage  
2. A **floating orange “⚡AI” button** appears beside the selected text  
3. Click it to open the QuiSum popup  
4. Choose one of three actions:  
   - 🪄 **Summarize** → get concise points instantly  
   - 🧩 **Quizify** → take an AI-generated quiz  
   - 💬 **Chat** → converse with Chrome AI about the content  
5. During quiz mode:  
   - 🌑 **Screen darkens** for distraction-free learning  
   - 🧠 Questions appear with randomized options  
6. Return to normal view or switch tabs anytime  

---

## 🧱 Tech Stack & Architecture

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML, CSS, Vanilla JS (Material Design-inspired UI) |
| **Browser APIs** | Chrome AI Prompt API, Chrome Summarizer API |
| **Content Script** | Detects text selection, injects floating AI button |
| **Background Script** | Handles right-click actions and popup triggering |
| **Popup** | Displays results, chat UI, and quiz interface |
| **Permissions** | `activeTab`, `scripting`, `contextMenus` |

**System Flow:**
```mermaid
graph TD;
A[User Selects Text] --> B[Floating ⚡AI Button Appears];
B --> C[Popup Triggered (Summarize / Quiz / Chat)];
C --> D[Chrome Summarizer or Prompt API];
D --> E[Render Output in Popup];
E --> F[Quiz Mode Activates Dark Overlay];
F --> G[User Interacts, Focused Screen];
