const questions = [
  // Visual
  { type: "Visual", question: "Você entende melhor quando vê gráficos, diagramas ou imagens explicando algo?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Você prefere mapas e imagens do que textos longos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Você gosta de usar cores, setas ou desenhos para organizar suas ideias?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Você lembra melhor de informações quando vê imagens do que quando apenas lê ou ouve?", options: ["Sim", "Mais ou menos", "Não"] },

  // Auditivo
  { type: "Auditivo", question: "Você aprende melhor ouvindo explicações em vez de apenas ler?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Você costuma prestar mais atenção quando alguém fala do que quando lê um texto?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Você gosta de estudar ouvindo música ou podcasts?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Você entende melhor quando conversa sobre o assunto com outras pessoas?", options: ["Sim", "Mais ou menos", "Não"] },

  // Leitura/Escrita
  { type: "Leitura/Escrita", question: "Você prefere ler instruções em vez de assistir a vídeos explicativos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Você gosta de escrever anotações, resumos ou listas para lembrar das coisas?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Você entende melhor um conteúdo quando o lê por conta própria?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Você tem facilidade em aprender lendo textos, artigos ou livros?", options: ["Sim", "Mais ou menos", "Não"] },

  // Cinestésico
  { type: "Cinestésico", question: "Você aprende melhor fazendo algo na prática do que só ouvindo ou lendo?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Você prefere atividades que envolvem movimento ou ação?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Você entende melhor quando participa ou experimenta o que está aprendendo?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Você tem mais facilidade em lembrar de algo quando coloca a mão na massa?", options: ["Sim", "Mais ou menos", "Não"] }
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
    setTimeout(showQuestion, 100);
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
