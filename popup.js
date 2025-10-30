const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const countdownDisplay = document.getElementById('countdown');
const outputpdf=document.getElementById('pdfTextOutput');
let countdownInterval;




uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    status.style.color = '#56ccf2';
    status.textContent = `📁 ${fileInput.files[0].name} ready to upload`;
  }
});

document.getElementById('generateBtn').addEventListener('click', () => {
  const topic = document.getElementById('topicInput').value.trim();
  const difficulty = document.getElementById('difficulty').value;
  const questions = document.getElementById('questions').value;
  const type = document.getElementById('type').value;
  const timerValue = document.getElementById('timer').value;

  if (!topic && fileInput.files.length === 0) {
    status.style.color = '#ff6b6b';
    status.textContent = '⚠️ Please upload a file or enter a topic!';
    return;
  }

  status.style.color = '#6cffb1';
  status.textContent = '🧠 Generating quiz...';
  countdownDisplay.textContent = '';

  setTimeout(() => {
    status.textContent = '✅ Quiz generated successfully!';
    if (timerValue !== "none")
         startTimer(parseInt(timerValue));
  }, 1800);
});

function startTimer(seconds) {
  clearInterval(countdownInterval);
  let remaining = seconds;

  countdownDisplay.textContent = `⏱️ Time Left: ${remaining}s`;

  countdownInterval = setInterval(() => {
    remaining--;
    countdownDisplay.textContent = `⏱️ Time Left: ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "⏰ Time's up!";
      status.style.color = '#ff6b6b';
      status.textContent = 'Quiz session ended.';
    }
  }, 1000);
}
