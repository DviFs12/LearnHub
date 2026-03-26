// ═══════════════════════════════════════════
//  LearnHub · Tutorial System
//  Inclua este script no final do <body>
//  Requer: state.js e themes.js já carregados
// ═══════════════════════════════════════════

(function () {
  // ── Não exibe se já foi visto ──
  const TUTORIAL_KEY = 'lh_tutorial_seen_v1';

  function alreadySeen() {
    try { return !!localStorage.getItem(TUTORIAL_KEY); } catch (e) { return false; }
  }
  function markSeen() {
    try { localStorage.setItem(TUTORIAL_KEY, '1'); } catch (e) {}
  }

  // ── Detecta em qual página estamos ──
  const page = location.pathname.includes('course.html') ? 'course' : 'index';

  // ── Definição dos passos por página ──
  const STEPS = {
    index: [
      {
        title: 'Bem-vindo ao LearnHub! 👋',
        text: 'Esta é a plataforma de cursos interativos offline. Em poucos passos vou te mostrar como tudo funciona.',
        target: null,
        position: 'center',
      },
      {
        title: 'Seus cursos',
        text: 'Aqui ficam todos os cursos disponíveis. Clique em um card para começar ou continuar de onde parou.',
        target: '#courses-grid',
        position: 'bottom',
      },
      {
        title: 'Seus pontos ⭐',
        text: 'Você ganha pontos completando lições e respondendo corretamente. Use-os para desbloquear temas na Loja!',
        target: '.pill-points',
        position: 'bottom',
      },
      {
        title: 'Loja de temas 🎨',
        text: 'Clique em "Loja" para trocar as cores da plataforma. Temas são desbloqueados com pontos.',
        target: 'a[href="store.html"]',
        position: 'bottom',
      },
      {
        title: 'Alternar tema 🌙',
        text: 'Este botão alterna entre o modo claro e escuro instantaneamente.',
        target: '#theme-btn',
        position: 'bottom',
      },
      {
        title: 'Adicionar cursos +',
        text: 'Clique em "+ Adicionar curso" para carregar cursos de outros repositórios GitHub via URL.',
        target: '.course-card-add',
        position: 'top',
      },
      {
        title: 'Tudo pronto! 🚀',
        text: 'Você já sabe o essencial. Bons estudos — cada lição concluída traz pontos e mantém seu streak ativo!',
        target: null,
        position: 'center',
      },
    ],
    course: [
      {
        title: 'Bem-vindo ao curso! 📚',
        text: 'Aqui você estuda de forma interativa. Teoria, exercícios e apostila — tudo integrado.',
        target: null,
        position: 'center',
      },
      {
        title: 'Barra de progresso',
        text: 'Acompanha seu avanço dentro da lição atual. Cada passo concluído avança a barra.',
        target: '.lesson-prog-wrap',
        position: 'bottom',
      },
      {
        title: 'Sidebar de navegação ☰',
        text: 'No menu lateral (ou no botão ☰ no mobile) você vê todas as unidades e lições. Clique para navegar diretamente.',
        target: '#sidebar',
        position: 'right',
      },
      {
        title: 'Apostila 📖',
        text: 'A aba "Apostila" na sidebar reúne todo o conteúdo teórico do curso em um só lugar para consulta rápida.',
        target: '#tab-ap',
        position: 'bottom',
      },
      {
        title: 'Pular lições ↷',
        text: 'O botão "Pular ↷" permite avançar para qualquer lição — útil se você já tem conhecimento prévio.',
        target: '.skip-btn',
        position: 'bottom',
      },
      {
        title: 'Vidas ❤️',
        text: 'Você tem 3 vidas por lição. Cada resposta errada consome uma. Se acabarem, repita a lição.',
        target: '#lives-disp',
        position: 'bottom',
      },
      {
        title: 'Tudo pronto! 🎯',
        text: 'Complete as lições em ordem para desbloquear as próximas. Bons estudos e boas notas!',
        target: null,
        position: 'center',
      },
    ],
  };

  // ── Estado do tutorial ──
  let currentStep = 0;
  let steps = [];
  let overlay, spotlight, card, stepIndicator;

  function init(force) {
    if (!force && alreadySeen()) return;
    steps = STEPS[page] || STEPS.index;
    currentStep = 0;
    buildDOM();
    showStep(0);
  }

  // ── Constrói o DOM do tutorial ──
  function buildDOM() {
    // Remove instância anterior
    document.getElementById('lh-tutorial-root')?.remove();

    const root = document.createElement('div');
    root.id = 'lh-tutorial-root';
    root.innerHTML = `
      <style>
        #lh-tutorial-root * { box-sizing: border-box; }

        #lh-tut-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0); pointer-events: none;
          transition: background 0.35s ease;
        }
        #lh-tut-overlay.active {
          background: rgba(0,0,0,0.65);
          pointer-events: auto;
        }

        /* Spotlight: buraco recortado no overlay usando clip-path */
        #lh-tut-spotlight {
          position: fixed; z-index: 9001;
          border-radius: 12px;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.65);
          pointer-events: none;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          opacity: 0;
        }
        #lh-tut-spotlight.visible { opacity: 1; }

        /* Card de instrução */
        #lh-tut-card {
          position: fixed; z-index: 9100;
          background: var(--paper, #fff);
          border: 1px solid var(--line, #ddd);
          border-radius: 18px;
          padding: 24px 22px 18px;
          width: min(340px, 92vw);
          box-shadow: 0 16px 48px rgba(0,0,0,0.25);
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          opacity: 0; transform: scale(0.92) translateY(8px);
        }
        #lh-tut-card.visible { opacity: 1; transform: scale(1) translateY(0); }

        /* Seta indicadora */
        #lh-tut-card::before {
          content: '';
          position: absolute;
          width: 12px; height: 12px;
          background: var(--paper, #fff);
          border-left: 1px solid var(--line, #ddd);
          border-top: 1px solid var(--line, #ddd);
          display: none;
        }
        #lh-tut-card.arrow-top::before {
          display: block; top: -7px; left: 24px;
          transform: rotate(45deg);
        }
        #lh-tut-card.arrow-bottom::before {
          display: block; bottom: -7px; left: 24px;
          transform: rotate(225deg);
          border-left: none; border-top: none;
          border-right: 1px solid var(--line, #ddd);
          border-bottom: 1px solid var(--line, #ddd);
        }
        #lh-tut-card.arrow-right::before {
          display: block; top: 24px; right: -7px;
          transform: rotate(135deg);
          border-left: none; border-top: none;
          border-right: 1px solid var(--line, #ddd);
          border-bottom: 1px solid var(--line, #ddd);
        }

        .tut-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 10px;
          margin-bottom: 10px;
        }
        .tut-title {
          font-family: 'Fraunces', serif;
          font-size: 1.05rem; font-weight: 700;
          color: var(--ink, #1a1814); line-height: 1.2;
        }
        .tut-skip {
          font-size: 0.72rem; color: var(--ink3, #8a847e);
          cursor: pointer; padding: 3px 8px; border-radius: 6px;
          border: 1px solid var(--line, #ddd); background: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap; flex-shrink: 0;
          transition: all 0.15s;
        }
        .tut-skip:hover { color: var(--ink2, #4a4540); border-color: var(--ink3, #8a847e); }

        .tut-text {
          font-size: 0.875rem; color: var(--ink2, #4a4540);
          line-height: 1.65; margin-bottom: 18px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 300;
        }

        .tut-footer {
          display: flex; align-items: center;
          justify-content: space-between; gap: 10px;
        }
        .tut-dots { display: flex; gap: 5px; }
        .tut-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--line, #ddd); transition: all 0.2s;
        }
        .tut-dot.active {
          background: var(--accent, #c2410c);
          width: 18px; border-radius: 4px;
        }
        .tut-btns { display: flex; gap: 8px; }
        .tut-btn {
          padding: 8px 18px; border-radius: 9px;
          font-size: 0.82rem; font-weight: 600;
          border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
        }
        .tut-btn-prev {
          background: var(--paper2, #f5f1eb);
          color: var(--ink2, #4a4540);
          border: 1px solid var(--line, #ddd);
        }
        .tut-btn-prev:hover { background: var(--paper3, #ede8df); }
        .tut-btn-next {
          background: var(--accent, #c2410c);
          color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .tut-btn-next:hover { opacity: 0.88; }

        @media (max-width: 500px) {
          #lh-tut-card { width: 96vw; padding: 20px 16px 14px; border-radius: 14px; }
          .tut-title { font-size: 0.95rem; }
          .tut-text { font-size: 0.82rem; }
        }
      </style>

      <div id="lh-tut-overlay"></div>
      <div id="lh-tut-spotlight"></div>
      <div id="lh-tut-card">
        <div class="tut-header">
          <div class="tut-title" id="tut-title"></div>
          <button class="tut-skip" onclick="window.__lhTutorial.skip()">Pular tutorial</button>
        </div>
        <div class="tut-text" id="tut-text"></div>
        <div class="tut-footer">
          <div class="tut-dots" id="tut-dots"></div>
          <div class="tut-btns">
            <button class="tut-btn tut-btn-prev" id="tut-prev" onclick="window.__lhTutorial.prev()">← Anterior</button>
            <button class="tut-btn tut-btn-next" id="tut-next" onclick="window.__lhTutorial.next()">Próximo →</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    overlay    = document.getElementById('lh-tut-overlay');
    spotlight  = document.getElementById('lh-tut-spotlight');
    card       = document.getElementById('lh-tut-card');

    // Ativar overlay com delay para a transição
    requestAnimationFrame(() => overlay.classList.add('active'));
  }

  // ── Renderiza um passo ──
  function showStep(idx) {
    if (idx < 0 || idx >= steps.length) return;
    currentStep = idx;
    const step = steps[idx];

    // Conteúdo
    document.getElementById('tut-title').textContent = step.title;
    document.getElementById('tut-text').textContent  = step.text;

    // Dots
    const dotsEl = document.getElementById('tut-dots');
    dotsEl.innerHTML = steps.map((_, i) =>
      `<div class="tut-dot ${i === idx ? 'active' : ''}"></div>`
    ).join('');

    // Botões
    const prevBtn = document.getElementById('tut-prev');
    const nextBtn = document.getElementById('tut-next');
    prevBtn.style.display = idx === 0 ? 'none' : 'block';
    nextBtn.textContent = idx === steps.length - 1 ? 'Concluir ✓' : 'Próximo →';

    // Esconde card antes de reposicionar
    card.classList.remove('visible', 'arrow-top', 'arrow-bottom', 'arrow-right');
    spotlight.classList.remove('visible');

    setTimeout(() => positionStep(step), 60);
  }

  // ── Posiciona spotlight e card ──
  function positionStep(step) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const PAD = 10; // padding do spotlight

    let targetRect = null;

    if (step.target) {
      // Tenta encontrar o elemento
      const el = document.querySelector(step.target);
      if (el) {
        const r = el.getBoundingClientRect();
        // Garante que está visível
        if (r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0) {
          targetRect = {
            top:    Math.max(0, r.top - PAD),
            left:   Math.max(0, r.left - PAD),
            width:  Math.min(r.width  + PAD * 2, vw),
            height: Math.min(r.height + PAD * 2, vh),
          };
          // Scroll suave para o elemento
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    if (targetRect) {
      // Aplica spotlight
      spotlight.style.left   = targetRect.left + 'px';
      spotlight.style.top    = targetRect.top  + 'px';
      spotlight.style.width  = targetRect.width  + 'px';
      spotlight.style.height = targetRect.height + 'px';
      spotlight.classList.add('visible');

      // Posiciona o card
      const cardW = Math.min(340, vw * 0.92);
      const cardH = 180; // estimativa
      const spaceBelow = vh - (targetRect.top + targetRect.height);
      const spaceAbove = targetRect.top;
      const spaceRight = vw - (targetRect.left + targetRect.width);

      let cardTop, cardLeft;
      let arrowClass = '';

      if (step.position === 'right' && spaceRight > cardW + 20) {
        // Card à direita
        cardLeft = targetRect.left + targetRect.width + 14;
        cardTop  = Math.min(targetRect.top, vh - cardH - 16);
        cardTop  = Math.max(8, cardTop);
        arrowClass = 'arrow-right';
      } else if (spaceBelow >= cardH + 24) {
        // Card abaixo
        cardTop  = targetRect.top + targetRect.height + 14;
        cardLeft = Math.min(targetRect.left, vw - cardW - 8);
        cardLeft = Math.max(8, cardLeft);
        arrowClass = 'arrow-top';
      } else if (spaceAbove >= cardH + 24) {
        // Card acima
        cardTop  = targetRect.top - cardH - 14;
        cardLeft = Math.min(targetRect.left, vw - cardW - 8);
        cardLeft = Math.max(8, cardLeft);
        arrowClass = 'arrow-bottom';
      } else {
        // Fallback: centralizado
        cardLeft = (vw - cardW) / 2;
        cardTop  = (vh - cardH) / 2;
      }

      card.style.left = cardLeft + 'px';
      card.style.top  = cardTop  + 'px';
      card.style.bottom = 'auto';
      card.style.transform = '';
      if (arrowClass) card.classList.add(arrowClass);

    } else {
      // Centrado — sem spotlight
      spotlight.style.width  = '0';
      spotlight.style.height = '0';
      spotlight.style.top    = '50%';
      spotlight.style.left   = '50%';
      spotlight.style.boxShadow = 'none';

      card.style.left      = '50%';
      card.style.top       = '50%';
      card.style.bottom    = 'auto';
      card.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    // Mostra card
    requestAnimationFrame(() => card.classList.add('visible'));
  }

  // ── Controles ──
  function next() {
    if (currentStep >= steps.length - 1) {
      finish();
    } else {
      showStep(currentStep + 1);
    }
  }

  function prev() {
    if (currentStep > 0) showStep(currentStep - 1);
  }

  function skip() {
    finish();
  }

  function finish() {
    markSeen();
    card.classList.remove('visible');
    spotlight.classList.remove('visible');
    overlay.classList.remove('active');
    setTimeout(() => {
      document.getElementById('lh-tutorial-root')?.remove();
    }, 400);
  }

  // ── Reposiciona ao redimensionar ──
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (document.getElementById('lh-tutorial-root')) {
        positionStep(steps[currentStep]);
      }
    }, 120);
  });

  // ── API pública ──
  window.__lhTutorial = { init, next, prev, skip, finish };

  // ── Auto-inicia após a página renderizar ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => init(false), 600));
  } else {
    setTimeout(() => init(false), 600);
  }

})();
