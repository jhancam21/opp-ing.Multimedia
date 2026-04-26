/* ============================================================
   FUNDAMENTOS DE INGENIERÍA MULTIMEDIA — script.js
   ============================================================ */

   
document.addEventListener('play', function(e) {
  const media = document.querySelectorAll('audio, video');

  media.forEach(m => {
    if (m !== e.target) {
      m.pause();
    }
  });

}, true);

  // 🧱 cuando el usuario entra al iframe (click)
  document.querySelectorAll('iframe').forEach(frame => {

    frame.addEventListener('mouseenter', () => {
      pauseAllMedia();
    });

    frame.addEventListener('click', () => {
      pauseAllMedia();
    });

  });

});

function pauseAllMedia() {
  document.querySelectorAll('audio, video').forEach(m => m.pause());
}


// ---- NAVEGACIÓN ENTRE SECCIONES ---------------------------

const sections = ['inicio', 'multimedia', 'tipos', 'aplicaciones', 'rol', 'quiz'];

/**
 * Navega a la sección indicada y actualiza los botones del menú.
 * @param {string} id - ID de la sección (sin prefijo "s-")
 */
function goTo(id) {
  // Ocultar todas las secciones
  sections.forEach(s => {
    document.getElementById('s-' + s).classList.remove('visible');
  });

  // Actualizar estado de botones de navegación
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    if (sections[i] === id) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Mostrar la sección seleccionada
  document.getElementById('s-' + id).classList.add('visible');

  // Hacer scroll al inicio de la página
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Inicializar el quiz si se navega a esa sección
  if (id === 'quiz') initQuiz();
}

// ---- TARJETAS EXPANDIBLES (TIPOS) -------------------------

/**
 * Alterna la visibilidad del detalle de un tipo de multimedia.
 * @param {string} tipo - Nombre del tipo (texto, imagen, audio, video, animacion)
 */
function toggleTipo(tipo) {
  const detail = document.getElementById('td-' + tipo);
  const isOpen = detail.style.display === 'block';

  // Cerrar todos los detalles
  document.querySelectorAll('.tipo-detail').forEach(d => {
    d.style.display = 'none';
  });

  // Abrir el seleccionado si estaba cerrado
  if (!isOpen) {
    detail.style.display = 'block';
  }
}

// ---- QUIZ -------------------------------------------------

const questions = [
  {
    q: '¿Qué significa el término "multimedia"?',
    opts: [
      'Un solo tipo de medio digital',
      'La combinación de múltiples medios digitales',
      'Solo video y audio',
      'Una red de computadores'
    ],
    a: 1,
    exp: 'Multimedia combina "multi" (múltiple) y "media" (medios): integra dos o más tipos de contenido digital.'
  },
  {
    q: '¿Cuál es la diferencia entre imágenes rasterizadas y vectoriales?',
    opts: [
      'Las vectoriales pesan más',
      'Las rasterizadas están formadas por píxeles; las vectoriales por ecuaciones matemáticas',
      'Las rasterizadas son siempre más grandes',
      'No hay diferencia práctica'
    ],
    a: 1,
    exp: 'Las imágenes rasterizadas (JPEG, PNG) se forman por píxeles. Las vectoriales (SVG) se definen matemáticamente y escalan sin pérdida.'
  },
  {
    q: '¿Qué parámetro mide la cantidad de imágenes por segundo en un video?',
    opts: [
      'Resolución',
      'Bitrate',
      'FPS (fotogramas por segundo)',
      'Frecuencia de muestreo'
    ],
    a: 2,
    exp: 'Los FPS (frames per second) determinan cuántas imágenes se muestran por segundo. A mayor FPS, más fluido es el movimiento.'
  },
  {
    q: '¿Cuál de estos es un formato de audio SIN pérdida de calidad?',
    opts: ['MP3', 'AAC', 'OGG', 'FLAC'],
    a: 3,
    exp: 'FLAC (Free Lossless Audio Codec) conserva toda la información original del audio sin eliminar datos.'
  },
  {
    q: '¿Quién acuñó el término "hipertexto", precursor de la multimedia no lineal?',
    opts: ['Tim Berners-Lee', 'Vannevar Bush', 'Ted Nelson', 'Steve Jobs'],
    a: 2,
    exp: 'Ted Nelson acuñó "hipertexto" en 1960, aunque Vannevar Bush conceptualizó el Memex en 1945.'
  },
  {
    q: '¿Cuál es una habilidad fundamental del Ingeniero Multimedia?',
    opts: [
      'Solo programación avanzada',
      'Solo diseño gráfico',
      'Integrar tecnología, diseño y comunicación',
      'Solo producción de video'
    ],
    a: 2,
    exp: 'El Ingeniero Multimedia trabaja en la intersección de tecnología, diseño y comunicación, integrando todas estas disciplinas.'
  }
];

let current  = 0;
let score    = 0;
let answered = false;

/** Inicializa o reinicia el quiz al estado inicial. */
function initQuiz() {
  current  = 0;
  score    = 0;
  answered = false;

  document.getElementById('quiz-result').style.display    = 'none';
  document.getElementById('quiz-container').style.display = 'block';

  renderQuestion();
}

/** Renderiza la pregunta actual en el DOM. */
function renderQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }

  const q = questions[current];

  // Actualizar contador y barra de progreso
  document.getElementById('quiz-counter').textContent =
    `Pregunta ${current + 1} de ${questions.length}`;
  document.getElementById('quiz-progress').style.width =
    `${(current / questions.length) * 100}%`;

  // Mostrar pregunta
  document.getElementById('quiz-question').textContent = q.q;

  // Generar opciones
  const optsContainer = document.getElementById('quiz-options');
  optsContainer.innerHTML = '';

  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'quiz-opt';
    btn.textContent = opt;
    btn.onclick     = () => answerQuestion(i, btn);
    optsContainer.appendChild(btn);
  });

  // Resetear feedback y botón siguiente
  const feedback = document.getElementById('quiz-feedback');
  feedback.style.display = 'none';
  feedback.textContent   = '';

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.style.display = 'none';

  answered = false;
}

/**
 * Procesa la respuesta del usuario.
 * @param {number} index - Índice de la opción elegida
 * @param {HTMLElement} btn - Botón presionado
 */
function answerQuestion(index, btn) {
  if (answered) return;
  answered = true;

  const q    = questions[current];
  const opts = document.querySelectorAll('.quiz-opt');
  const fb   = document.getElementById('quiz-feedback');
  const next = document.getElementById('quiz-next-btn');

  // Deshabilitar todas las opciones
  opts.forEach(b => b.disabled = true);

  if (index === q.a) {
    btn.classList.add('correct');
    fb.textContent  = '✓ Correcto. ' + q.exp;
    fb.style.color  = '#1D9E75';
    score++;
  } else {
    btn.classList.add('wrong');
    opts[q.a].classList.add('correct');
    fb.textContent  = '✗ Incorrecto. ' + q.exp;
    fb.style.color  = '#D85A30';
  }

  fb.style.display   = 'block';
  next.style.display = 'block';
  next.textContent   = current === questions.length - 1
    ? 'Ver resultado →'
    : 'Siguiente →';
}

/** Avanza a la siguiente pregunta. */
function nextQuestion() {
  current++;
  renderQuestion();
}

/** Muestra el resultado final del quiz. */
function showResult() {
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('quiz-result').style.display    = 'block';
  document.getElementById('quiz-progress').style.width    = '100%';

  document.getElementById('result-score').textContent =
    `${score} / ${questions.length}`;

  const pct = Math.round((score / questions.length) * 100);
  let msg, sub;

  if (pct >= 80) {
    msg = 'Excelente dominio del tema';
    sub = 'Tienes una sólida comprensión de los fundamentos multimedia.';
  } else if (pct >= 50) {
    msg = 'Buen progreso';
    sub = 'Repasa las secciones donde tuviste dudas y vuelve a intentarlo.';
  } else {
    msg = 'Sigue aprendiendo';
    sub = 'Recorre las secciones del módulo para reforzar tus conocimientos.';
  }

  document.getElementById('result-msg').textContent = msg;
  document.getElementById('result-sub').textContent = sub;
}

/** Reinicia el quiz desde cero. */
function resetQuiz() {
  initQuiz();
}

// ---- INICIALIZACIÓN ---------------------------------------
// El quiz se inicializa cuando se navega a esa sección (goTo → initQuiz).
// Aquí se garantiza que la sección de inicio sea la visible al cargar.
document.addEventListener('DOMContentLoaded', () => {
  goTo('inicio');
});
