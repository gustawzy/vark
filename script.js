const questions = [
  // Visual
  { type: "Visual", question: "Você entende melhor quando vê gráficos, diagramas ou imagens explicando algo?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Você prefere mapas e imagens do que textos longos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Você gosta de usar cores, setas ou desenhos para organizar suas ideias?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Visual", question: "Você lembra melhor de informações quando vê imagens?", options: ["Sim", "Mais ou menos", "Não"] },

  // Auditivo
  { type: "Auditivo", question: "Você aprende melhor ouvindo explicações?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Você costuma prestar mais atenção quando alguém fala?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Você gosta de estudar ouvindo música?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Auditivo", question: "Você entende melhor quando conversa sobre o assunto com outras pessoas?", options: ["Sim", "Mais ou menos", "Não"] },

  // Leitura/Escrita
  { type: "Leitura/Escrita", question: "Você prefere ler instruções em vez de assistir vídeos explicativos?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Você gosta de escrever anotações, resumos e mapas mentais para lembrar das coisas?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Você entende melhor um conteúdo quando o lê por conta própria?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Leitura/Escrita", question: "Você tem facilidade em aprender lendo textos, artigos ou livros?", options: ["Sim", "Mais ou menos", "Não"] },

  // Cinestésico
  { type: "Cinestésico", question: "Você aprende melhor fazendo algo na prática do que só ouvindo ou lendo?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Você prefere atividades que envolvem movimento ou ação?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Você entende melhor quando participa ou experimenta o que está aprendendo?", options: ["Sim", "Mais ou menos", "Não"] },
  { type: "Cinestésico", question: "Você tem mais facilidade em lembrar de algo quando pratica?", options: ["Sim", "Mais ou menos", "Não"] }
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(questions);

const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");
const resultExplanation = document.getElementById("result-explanation");
const scoreTable = document.getElementById("score-table");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
let scores = { Visual: 0, Auditivo: 0, "Leitura/Escrita": 0, Cinestésico: 0 };

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => location.reload());

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
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
    btn.onclick = () => selectAnswer(q.type, option, btn);
    quizContainer.appendChild(btn);
  });
}

function selectAnswer(type, option, clickedBtn) {
  document.querySelectorAll('.option').forEach(btn => {
    btn.onclick = null;
    btn.classList.add('disabled');
  });

  if (option === "Sim") scores[type] += 1;
  if (option === "Mais ou menos") scores[type] += 0.5;

  clickedBtn.classList.remove('disabled');
  clickedBtn.style.boxShadow = "0 0 18px rgba(183,110,255,0.5)";

  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(showQuestion, 160);
  } else {
    setTimeout(showResult, 220);
  }
}

function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  const values = Object.values(scores);
  const maxScore = Math.max(...values);
  const minScore = Math.min(...values);

  const bestTypes = Object.keys(scores).filter(type => scores[type] === maxScore);
  const allEqual = values.every(v => v === values[0]);

  let resultLabel = "";
  if (allEqual) {
    resultLabel = "Multimodal Total (equilíbrio entre todos os estilos)";
  } else if (bestTypes.length === 1) {
    resultLabel = `${bestTypes[0]}`;
  } else {
    resultLabel = `Multimodal (${bestTypes.join(" + ")})`;
  }

  resultText.textContent = resultLabel;

 // textos específicos por estilo
  const explanations = {
    "Visual": "Você aprende melhor por meio de recursos visuais, como diagramas, gráficos, imagens e esquemas. Elementos visuais ajudam a compreender e relembrar as informações com mais facilidade. Use cores, setas e mapas mentais para organizar o conteúdo de forma clara e atrativa.",
    "Auditivo": "Seu aprendizado vem pelo som. Você grava melhor quando ouve explicações, debates ou podcasts. Repetir o conteúdo em voz alta e conversar sobre o assunto ajuda a fixar. Se puder, estude explicando pra alguém ou ouvindo áudios educativos.",
    "Leitura/Escrita": "Você se dá bem com textos. Textos, anotações, listas e resumos são os métodos mais eficazes para o seu aprendizado. Transformar explicações em palavras escritas e reler com atenção ajuda a reforçar o que foi estudado..",
    "Cinestésico": "Você aprende com a prática. O movimento e o toque te ajudam mais do que ouvir ou ler. Experimente, monte, faça testes e se envolva fisicamente. Aprender só lendo ou vendo te deixa entediado rápido, então leve o conteúdo pra realidade com ações."
  };

  let explanation = "";
  if (allEqual) {
    explanation = "Você apresenta equilíbrio entre os quatro estilos de aprendizagem — visual, auditivo, leitura/escrita e cinestésico. Isso significa que você consegue se adaptar com facilidade a diferentes formas de ensino. Misturar técnicas visuais, auditivas, escritas e práticas pode tornar seu aprendizado ainda mais eficiente.";
  } else if (bestTypes.length === 1) {
    const tipo = bestTypes[0];
    explanation = `<strong>${tipo}</strong>: ${explanations[tipo]}`;
  } else {
    explanation = `Você apresenta características de múltiplos estilos de aprendizagem: <strong>${bestTypes.join("</strong>, <strong>")}</strong>. Essa combinação torna seu aprendizado mais flexível e eficiente.<br><br>`;
    bestTypes.forEach(t => {
      explanation += `<strong>${t}:</strong> ${explanations[t]}<br><br>`;
    });
  }

  resultExplanation.innerHTML = explanation;

  const sorted = Object.entries(scores)
    .map(([k, v]) => ({ k, v }))
    .sort((a, b) => b.v - a.v);

  scoreTable.innerHTML = "";
  const highest = Math.max(...sorted.map(x => x.v), 1);

  sorted.forEach(row => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.classList.add('score-name');
    tdName.textContent = row.k;

    const tdValue = document.createElement('td');
    tdValue.classList.add('score-value');
    tdValue.textContent = (Number.isInteger(row.v) ? row.v.toString() : row.v.toFixed(1));

    const tdBar = document.createElement('td');
    tdBar.classList.add('score-bar');

    const barBg = document.createElement('div');
    barBg.classList.add('bar-bg');

    const barFill = document.createElement('div');
    barFill.classList.add('bar-fill');

    const widthPercent = Math.round((row.v / highest) * 100);
    barFill.style.width = "0%";
    barFill.setAttribute('data-target-width', widthPercent + '%');

    barBg.appendChild(barFill);
    tdBar.appendChild(barBg);

    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdBar);

    scoreTable.appendChild(tr);
  });

  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach((el, i) => {
      const target = el.getAttribute('data-target-width') || '0%';
      setTimeout(() => {
        el.style.width = target;
      }, i * 120);
    });
  });
}
