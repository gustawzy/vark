const questions = [
  // Visual
  { type: "Visual", question: "Você entende melhor quando vê gráficos ou diagramas?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Prefere mapas e imagens a textos longos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Gosta de usar cores e desenhos para organizar ideias?", options: ["Sim", "Mais ou menos", "Não"] },
  
  // Auditivo
  { type: "Auditivo", question: "Aprende melhor ouvindo explicações?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Gosta de estudar com música?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Lembra melhor do que ouve do que do que lê?", options: ["Sim", "Mais ou menos", "Não"] },

  // Leitura/Escrita
  { type: "Leitura/Escrita", question: "Prefere ler instruções do que ver vídeos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Gosta de escrever anotações e resumos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Aprende melhor lendo textos e artigos?", options: ["Sim", "Mais ou menos", "Não"] },

  // Cinestésico
  { type: "Cinestésico", question: "Aprende melhor praticando?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Prefere atividades físicas a teóricas?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Entende melhor quando faz algo com as mãos?", options: ["Sim", "Mais ou menos", "Não"] }
];

const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");

let currentQuestion = 0;
let scores = { Visual: 0, Auditivo: 0, "Leitura/Escrita": 0, Cinestésico: 0 };

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  startBtn.classList.add("hidden");
  showQuestion();
}

function showQuestion() {
  quizContainer.innerHTML = "";
  const q = questions[currentQuestion];

  const questionEl = document.createElement("h2");
  questionEl.classList.add("question");
  questionEl.textContent = q.question;
  quizContainer.appendChild(questionEl);

  q.options.forEach(option => {
    const btn = document.createElement("div");
    btn.textContent = option;
    btn.classList.add("option");
    btn.onclick = () => selectAnswer(q.type, option);
    quizContainer.appendChild(btn);
  });
}

function selectAnswer(type, option) {
  if (option === "Sim") scores[type] += 2;
  if (option === "Mais ou menos") scores[type] += 1;

  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(showQuestion, 400);
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  let bestType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  resultText.textContent = bestType;
}
