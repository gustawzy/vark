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

// função para embaralhar arrays
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(questions); // embaralha as perguntas

const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");
const resultExplanation = document.getElementById("result-explanation");
const scoreTable = document.getElementById("score-table");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
// pontuação agora: Sim = 1, Mais ou menos = 0.5, Não = 0
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

  // mantém as opções na ordem original
  q.options.forEach(option => {
    const btn = document.createElement("div");
    btn.textContent = option;
    btn.classList.add("option");
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    // permitir seleção por Enter/Space para acessibilidade
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
  // desativa todas as opções depois do clique
  const options = document.querySelectorAll('.option');
  options.forEach(btn => {
    btn.onclick = null;
    btn.classList.add('disabled');
  });

  // aplicação da regra: Sim = 1, Mais ou menos = 0.5, Não = 0
  if (option === "Sim") scores[type] += 1;
  if (option === "Mais ou menos") scores[type] += 0.5;
  // "Não" não adiciona nada

  // pequeno feedback visual
  if (clickedBtn) {
    clickedBtn.classList.remove('disabled');
    clickedBtn.style.boxShadow = "0 0 18px rgba(183,110,255,0.5)";
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    // curtíssima pausa para UX
    setTimeout(showQuestion, 160);
  } else {
    setTimeout(showResult, 220);
  }
}

function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  // calcular resultado
  const values = Object.values(scores);
  const maxScore = Math.max(...values);
  const minScore = Math.min(...values);

  // tolerância para considerar "quase igual" -> ajustável
  const TOLERANCE = 0.5;

  // identificar todos os estilos que alcançam a pontuação máxima (empate exato)
  let bestTypes = Object.keys(scores).filter(type => Math.abs(scores[type] - maxScore) < 1e-9);

  // checar Multimodal Total (todos os 4 bem próximos)
  let isMultimodalTotal = (maxScore - minScore) <= TOLERANCE;

  let resultLabel = "";
  if (isMultimodalTotal) {
    resultLabel = "Multimodal Total (equilíbrio entre todos os estilos)";
  } else if (bestTypes.length === 1) {
    resultLabel = `${bestTypes[0]} (Unimodal)`;
  } else {
    // Multimodal parcial (2 ou 3 estilos empatados como maiores)
    resultLabel = `Multimodal (${bestTypes.join(" + ")})`;
  }

  // exibir resultado principal
  resultText.textContent = resultLabel;

  // montar explicação curta
  let explanation = "";
  if (isMultimodalTotal) {
    explanation = "Você tem pontuações bem próximas nos quatro estilos — adapta-se bem a várias formas de aprendizado. Tenta misturar técnicas (gráficos, áudio, leitura e prática).";
  } else if (bestTypes.length === 1) {
    explanation = `Seu estilo dominante parece ser <strong>${bestTypes[0]}</strong>. Aproveite métodos focados nesse estilo para aprender mais rápido.`;
  } else {
    explanation = `Você tem preferência por múltiplos estilos: <strong>${bestTypes.join("</strong> e <strong>")}</strong>. Combine estratégias desses estilos para melhores resultados.`;
  }
  resultExplanation.innerHTML = explanation;

  // construir tabela de pontuação (ordenada)
  const sorted = Object.entries(scores)
    .map(([k, v]) => ({ k, v }))
    .sort((a, b) => b.v - a.v);

  // limpar tabela
  scoreTable.innerHTML = "";

  // calcular maior possível para normalizar barras (max perguntas por tipo = 4 * 1 = 4)
  // mas usamos o max alcançado para animação visual.
  const maxPossible = 4; // 4 perguntas por estilo * 1 ponto por pergunta
  const highest = Math.max(...sorted.map(x => x.v), 1);

  sorted.forEach(row => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.classList.add('score-name');
    tdName.textContent = row.k;

    const tdValue = document.createElement('td');
    tdValue.classList.add('score-value');
    // mostrar com uma casa decimal quando tiver .5
    tdValue.textContent = (Number.isInteger(row.v) ? row.v.toString() : row.v.toFixed(1));

    const tdBar = document.createElement('td');
    tdBar.classList.add('score-bar');

    const barBg = document.createElement('div');
    barBg.classList.add('bar-bg');

    const barFill = document.createElement('div');
    barFill.classList.add('bar-fill');

    // largura relativa (0% - 100%) baseada no maior valor alcançado (para destacar)
    const widthPercent = Math.round((row.v / highest) * 100);
    barFill.style.width = "0%"; // iniciar em 0 para animar depois
    barFill.setAttribute('data-target-width', widthPercent + '%');

    barBg.appendChild(barFill);
    tdBar.appendChild(barBg);

    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdBar);

    scoreTable.appendChild(tr);
  });

  // animação das barras (pequeno delay)
  requestAnimationFrame(() => {
    const fills = document.querySelectorAll('.bar-fill');
    fills.forEach((el, i) => {
      const target = el.getAttribute('data-target-width') || '0%';
      // animação com tiny delay por linha
      setTimeout(() => {
        el.style.width = target;
      }, i * 120);
    });
  });
}
