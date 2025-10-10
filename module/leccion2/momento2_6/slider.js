export function init() {
  const tooltips = [
    {
      id: 1,
      title: 'Introducción a la Matriz de Riesgos',
      audio: './momento2_6/audio/audio1.mp3',
    },
    {
      id: 2,
      title: 'Eje Vertical: Probabilidad de Riesgo',
      audio: './momento2_6/audio/audio2.mp3',
    },
    {
      id: 3,
      title: 'Eje Horizontal: Impacto del Riesgo',
      audio: './momento2_6/audio/audio3.mp3',
    },
    {
      id: 4,
      title: 'Asignación de Valores y Convenciones de Color',
      audio: './momento2_6/audio/audio4.mp3',
    },
  ];

  let currentAudioEl = null;

  // Función global para pausar todos los audios excepto el actual
  const pauseAllAudios = (exceptAudio = null) => {
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
      if (audio !== exceptAudio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  const initializeTooltips = () => {
    const buttons = document.querySelectorAll('.tooltip-btn');
    const box = document.getElementById('tooltip-box');
    const title = document.getElementById('tooltip-title');
    const audio = document.getElementById('tooltip-audio');
    const number = document.getElementById('tooltip-number');
    const content = document.getElementById('tooltip-content');

    if (!buttons.length || !box) return;

    // Asegurar no autoplay: remover oncanplay auto-play
    audio.oncanplay = null;

    // Agregar control global a todos los audios existentes
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audioEl => {
      audioEl.addEventListener('play', () => {
        pauseAllAudios(audioEl);
        currentAudioEl = audioEl;
      });
    });

    const showTooltip = (tooltip) => {
      number.textContent = String(tooltip.id);
      title.textContent = tooltip.title;

      const src = audio.querySelector('source');
      src.src = tooltip.audio;
      audio.load();

      box.classList.remove('d-none');
      box.classList.add('show');
      box.style.opacity = '0';
      box.style.transform = 'translateX(-50%) scale(0.8)';
      setTimeout(() => {
        box.style.transition = 'all 0.3s ease';
        box.style.opacity = '1';
        box.style.transform = 'translateX(-50%) scale(1)';
      }, 10);
    };

    const hideTooltip = () => {
      box.style.transition = 'all 0.3s ease';
      box.style.opacity = '0';
      box.style.transform = 'translateX(-50%) scale(0.8)';
      setTimeout(() => {
        box.classList.add('d-none');
        box.classList.remove('show');
        pauseAllAudios();
      }, 300);
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        const tooltip = tooltips.find((t) => t.id === id);
        if (!tooltip) return;
        showTooltip(tooltip);
      });
    });

    const closeBtn = document.getElementById('tooltip-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideTooltip();
      });
    }

    document.addEventListener('click', (e) => {
      if (!box.classList.contains('d-none') && !box.contains(e.target) && !e.target.classList.contains('tooltip-btn')) {
        hideTooltip();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !box.classList.contains('d-none')) hideTooltip();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTooltips);
  } else {
    initializeTooltips();
  }

  setTimeout(initializeTooltips, 100);
}
