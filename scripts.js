document.addEventListener("DOMContentLoaded", () => {
  let current = 0;
  let score = 0;
  let issues = [];

  const landing = document.getElementById('landing');
  const quiz = document.getElementById('quiz');
  const results = document.getElementById('results');
  const questionCard = document.getElementById('questionCard');
  const remediationBox = document.getElementById('remediation');
  const progress = document.getElementById('progress');
  const scoreDisplay = document.getElementById('score');
  const issuesList = document.getElementById('issues');

  // 🔹 Create debug overlay
  const debugBox = document.createElement("div");
  debugBox.id = "debugBox";
  debugBox.style.position = "fixed";
  debugBox.style.bottom = "10px";
  debugBox.style.right = "10px";
  debugBox.style.background = "rgba(0,0,0,0.7)";
  debugBox.style.color = "white";
  debugBox.style.padding = "10px";
  debugBox.style.borderRadius = "8px";
  debugBox.style.fontSize = "12px";
  debugBox.style.zIndex = "9999";
  debugBox.innerText = "Debug: waiting…";
  document.body.appendChild(debugBox);

  function updateDebug(extra = "") {
    debugBox.innerHTML = `
      <b>Debug</b><br>
      Current Q: ${current + 1}/${questions.length}<br>
      Score: ${score}<br>
      Issues: ${issues.length}<br>
      ${extra}
    `;
  }

  document.getElementById('startBtn').addEventListener('click', () => {
    landing.classList.add('hidden');
    quiz.classList.remove('hidden');
    loadQuestion();
    updateDebug("Started quiz");
  });

  document.getElementById('yesBtn').addEventListener('click', () => {
    score++;
    updateDebug("Answered YES");
    nextQuestion();
  });

  document.getElementById('noBtn').addEventListener('click', () => {
    remediationBox.textContent = questions[current].remediation;
    remediationBox.classList.remove('hidden');
    issues.push(questions[current]);
    updateDebug("Answered NO");
    setTimeout(nextQuestion, 2000); // wait 2s to show remediation
  });

  document.getElementById('restartBtn').addEventListener('click', () => {
    current = 0;
    score = 0;
    issues = [];
    results.classList.add('hidden');
    landing.classList.remove('hidden');
    updateDebug("Restarted quiz");
  });

  function loadQuestion() {
    if (current < questions.length) {
      questionCard.textContent = questions[current].question;
      progress.textContent = `Question ${current + 1} of ${questions.length}`;
      remediationBox.classList.add('hidden');
      updateDebug("Loaded new question");
    } else {
      showResults();
    }
  }

  function nextQuestion() {
    current++;
    loadQuestion();
  }

  function showResults() {
    quiz.classList.add('hidden');
    results.classList.remove('hidden');
    const risk = (score / questions.length) * 100;
    let riskLabel = "High Risk ❌";
    if (risk >= 88) riskLabel = "Low Risk ✅";
    else if (risk >= 64) riskLabel = "Medium Risk ⚠️";

    scoreDisplay.textContent = `${score}/${questions.length} compliant – ${riskLabel}`;
    issuesList.innerHTML = issues
      .map(i => `<li>${i.question}<br><em>${i.remediation}</em></li>`)
      .join('');

    updateDebug(`Finished. Risk Score: ${risk.toFixed(1)}% (${riskLabel})`);
  }
});
