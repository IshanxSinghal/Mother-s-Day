(function(){
  const openNoteButton = document.getElementById('openNoteButton');
  const closeNoteButton = document.getElementById('closeNoteButton');
  const motherDayModal = document.getElementById('motherDayModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  let sparkleTimeoutId = null;

  function clearSparkles() {
    if (!motherDayModal) return;
    const existingSparkles = motherDayModal.querySelectorAll('.mother-modal__sparkle-layer');
    existingSparkles.forEach((sparkleLayer) => sparkleLayer.remove());
    if (sparkleTimeoutId) {
      clearTimeout(sparkleTimeoutId);
      sparkleTimeoutId = null;
    }
  }

  function createSparkles() {
    if (!motherDayModal) return;
    clearSparkles();

    const sparkleLayer = document.createElement('div');
    sparkleLayer.className = 'mother-modal__sparkle-layer';
    motherDayModal.appendChild(sparkleLayer);

    const sparklePositions = [
      { top: '10%', left: '10%' },
      { top: '16%', right: '12%' },
      { top: '24%', left: '18%' },
      { top: '30%', right: '22%' },
      { top: '64%', left: '12%' },
      { top: '72%', right: '14%' },
      { top: '82%', left: '24%' },
      { top: '18%', left: '50%' },
      { top: '78%', left: '54%' },
      { top: '44%', right: '8%' }
    ];

    sparklePositions.forEach((position, index) => {
      const sparkle = document.createElement('span');
      sparkle.className = 'mother-modal__sparkle';
      sparkle.style.animationDelay = `${index * 70}ms`;
      Object.assign(sparkle.style, position);
      sparkleLayer.appendChild(sparkle);
    });

    sparkleTimeoutId = setTimeout(() => {
      clearSparkles();
    }, 1200);
  }

  function openModal() {
    if (!motherDayModal || !modalBackdrop) return;
    motherDayModal.classList.add('is-open');
    modalBackdrop.hidden = false;
    requestAnimationFrame(() => modalBackdrop.classList.add('is-open'));
    motherDayModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    createSparkles();
  }

  function closeModal() {
    if (!motherDayModal || !modalBackdrop) return;
    motherDayModal.classList.remove('is-open');
    modalBackdrop.classList.remove('is-open');
    motherDayModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    clearSparkles();
    setTimeout(() => {
      if (!motherDayModal.classList.contains('is-open')) {
        modalBackdrop.hidden = true;
      }
    }, 260);
  }

  if (openNoteButton) openNoteButton.addEventListener('click', openModal);
  if (closeNoteButton) closeNoteButton.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  // Heart confetti generator with a larger impact area.
  function createConfetti(x, y) {
    const colors = ['#ff5d8f', '#ff8fab', '#ffc24b', '#7cd992', '#6ecbff', '#c59bff'];
    const confettiCount = 54;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti confetti-heart';
      confetti.style.left = x + 'px';
      confetti.style.top = y + 'px';
      confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
      
      const angle = (Math.PI * 2 * i) / confettiCount + (Math.random() - 0.5) * 0.35;
      const distance = 220 + Math.random() * 260;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance + 180;
      const duration = 2.1 + Math.random() * 1.4;
      const rot = (Math.random() > 0.5 ? 1 : -1) * (420 + Math.random() * 540);

      confetti.style.setProperty('--dx', `${dx}px`);
      confetti.style.setProperty('--dy', `${dy}px`);
      confetti.style.setProperty('--rot', `${rot}deg`);
      confetti.style.setProperty('--dur', `${duration}s`);

      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), duration * 1000 + 120);
    }
  }

  const balloons = document.querySelectorAll('.balloon');
  balloons.forEach(balloon => {
    const surface = balloon.querySelector('.balloon-surface');
    if (!surface) return;
    surface.addEventListener('click', async (e) => {
      // prevent repeated clicks
      if (balloon.dataset.revealed === '1') return;
      balloon.dataset.revealed = '1';

      // get position for confetti
      const rect = surface.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // animate pop
      surface.classList.add('bursting');

      // remove string and text label immediately for effect
      const stringEl = balloon.querySelector('.balloon-string');
      const textP = balloon.querySelector('p');
      const displayCaption = textP ? textP.textContent.trim() : (balloon.getAttribute('data-caption') || '');
      if (stringEl) stringEl.remove();
      if (textP) textP.remove();

      // wait for pop animation to finish
      await new Promise(r => setTimeout(r, 420));

      // trigger confetti
      createConfetti(centerX, centerY);

      // reveal photo and caption
      const photoUrl = balloon.getAttribute('data-photo');
      const captionText = displayCaption;

      // Use one shared size for all reveals, but keep it compact enough to avoid overlapping neighbors.
      const finalDiameter = Math.max(180, Math.min(240, Math.min(window.innerWidth * 0.34, window.innerHeight * 0.28)));

      balloon.style.display = 'flex';
      balloon.style.flexDirection = 'column';
      balloon.style.alignItems = 'center';
      balloon.style.justifyContent = 'flex-start';
      balloon.style.width = 'auto';
      balloon.style.height = 'auto';
      balloon.style.zIndex = '20';

      const photoWrap = document.createElement('div');
      photoWrap.className = 'revealed-photo';
      photoWrap.style.width = finalDiameter + 'px';
      photoWrap.style.height = finalDiameter + 'px';
      photoWrap.style.margin = '0';

      const img = document.createElement('img');
      img.src = './' + photoUrl;
      img.alt = captionText;
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = '100%';

      if (photoUrl === 'WarmHugs.jpeg') {
        img.style.objectPosition = 'center 38%';
      } else if (photoUrl === 'BedTimeStories.png') {
        img.style.objectPosition = 'center 34%';
      } else if (photoUrl === 'Best.jpeg') {
        img.style.objectPosition = 'center 32%';
      }

      const cap = document.createElement('div');
      cap.className = 'revealed-caption';
      cap.textContent = captionText;

      photoWrap.appendChild(img);
      // replace balloon content with the revealed photo and caption wrapper
      balloon.innerHTML = '';
      balloon.appendChild(photoWrap);
      // append caption below with a small margin
      const captionContainer = document.createElement('div');
      captionContainer.style.width = finalDiameter + 'px';
      captionContainer.style.margin = '6px 0 0';
      cap.style.fontSize = Math.max(14, Math.min(22, finalDiameter * 0.08)) + 'px';
      cap.style.lineHeight = '1.2';
      captionContainer.appendChild(cap);
      balloon.appendChild(captionContainer);
    });
  });
})();
