/* ═══════════════════════════════════════════
   FNAF: SISTER LOCATION — FANMADE
   UI Utilities
═══════════════════════════════════════════ */

const UI = (() => {

  // ── SCREEN MANAGEMENT ──
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    const el = document.getElementById('screen-' + id);
    if (el) {
      el.style.display = 'flex';
      el.classList.add('active');
      el.classList.remove('screen-fade-in');
      void el.offsetWidth;
      el.classList.add('screen-fade-in');
    }
  }

  // ── TOAST NOTIFICATIONS ──
  let toastEl = null;
  let toastTimer = null;

  function toast(msg, type = '', duration = 3000) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.className = 'toast ' + type;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  // ── TYPEWRITER EFFECT ──
  function typewrite(el, text, speed = 28, onDone) {
    el.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.innerHTML += text[i++];
      } else {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);
    return interval;
  }

  // ── ROOM BACKGROUND ──
  function setRoom(roomId) {
    const room = ROOMS[roomId];
    const bg = document.getElementById('room-bg');
    if (!bg) return;
    if (room && room.bg) {
      bg.style.backgroundImage = `url('${room.bg}')`;
    } else {
      bg.style.backgroundImage = 'none';
    }
    const locEl = document.getElementById('hud-location');
    if (locEl && room) locEl.textContent = room.name;
  }

  // ── SHOW/HIDE GAME UI PANELS ──
  function showGameUI(id) {
    document.querySelectorAll('.game-ui').forEach(el => el.classList.add('hidden'));
    const el = document.getElementById('ui-' + id);
    if (el) el.classList.remove('hidden');
  }

  function hideAllGameUI() {
    document.querySelectorAll('.game-ui').forEach(el => el.classList.add('hidden'));
  }

  // ── STAGE ANIMATRONIC ──
  function showAnimatronic(animId, onStage = true) {
    const el = document.getElementById('stage-animatronic');
    if (!el) return;
    if (onStage && animId) {
      const anim = ANIMATRONICS[animId];
      if (anim) {
        el.src = anim.img;
        el.classList.remove('hidden');
        el.style.display = 'block';
      }
    } else {
      el.classList.add('hidden');
      el.style.display = 'none';
    }
  }

  // ── STAGE LIGHT FLASH ──
  function flashLight() {
    const el = document.getElementById('stage-light');
    if (!el) return;
    el.classList.remove('hidden');
    el.style.display = 'block';
    setTimeout(() => {
      el.classList.add('hidden');
      el.style.display = 'none';
    }, 300);
  }

  // ── DIALOGUE BOX ──
  let dialogueQueue = [];
  let dialogueCallback = null;
  let currentDialogueIndex = 0;
  let currentDialogueLines = [];
  let currentSpeaker = 'HandUnit';

  function showDialogue(speaker, lines, onDone) {
    currentSpeaker = speaker;
    currentDialogueLines = lines;
    currentDialogueIndex = 0;
    dialogueCallback = onDone;

    const box = document.getElementById('dialogue-box');
    const spkEl = document.getElementById('dialogue-speaker');
    const txtEl = document.getElementById('dialogue-text');
    const nxtBtn = document.getElementById('dialogue-next');

    box.classList.remove('hidden');
    spkEl.textContent = speaker;

    // Speaker color
    const colors = {
      'HandUnit': '#1a6aff',
      'Angsty Teen': '#aa6600',
      'Circus Baby': '#ff4444',
      'Ennard': '#ff2200',
    };
    spkEl.style.color = colors[speaker] || '#1a6aff';

    nxtBtn.style.display = 'none';
    typewrite(txtEl, lines[0], 22, () => {
      nxtBtn.style.display = 'block';
    });
  }

  function advanceDialogue() {
    currentDialogueIndex++;
    const txtEl = document.getElementById('dialogue-text');
    const nxtBtn = document.getElementById('dialogue-next');

    if (currentDialogueIndex < currentDialogueLines.length) {
      nxtBtn.style.display = 'none';
      typewrite(txtEl, currentDialogueLines[currentDialogueIndex], 22, () => {
        nxtBtn.style.display = 'block';
      });
    } else {
      hideDialogue();
      if (dialogueCallback) dialogueCallback();
    }
  }

  function hideDialogue() {
    const box = document.getElementById('dialogue-box');
    box.classList.add('hidden');
  }

  // ── HUD ──
  function setHudNight(n) {
    const el = document.getElementById('hud-night');
    if (el) el.textContent = 'NIGHT ' + n;
  }

  function setHudMsg(msg) {
    const el = document.getElementById('hud-handunit-msg');
    if (el) el.textContent = msg;
  }

  function showHUD() {
    document.getElementById('game-hud').classList.remove('hidden');
  }

  function hideHUD() {
    document.getElementById('game-hud').classList.add('hidden');
  }

  // ── CAMERA SYSTEM ──
  let currentCam = 0;

  function buildCameraUI() {
    const btnContainer = document.getElementById('cam-buttons');
    const animList = document.getElementById('cam-animatronic-list');
    if (!btnContainer) return;

    btnContainer.innerHTML = '';
    CAMERAS.forEach((cam, i) => {
      const btn = document.createElement('button');
      btn.className = 'cam-btn' + (i === 0 ? ' active' : '');
      btn.textContent = cam.label;
      btn.dataset.camIndex = i;
      btn.addEventListener('click', () => switchCamera(i));
      btnContainer.appendChild(btn);
    });

    // Animatronic list
    if (animList) {
      animList.innerHTML = '<div class="cam-anim-title">ANIMATRONIC STATUS</div>';
      Object.values(ANIMATRONICS).forEach(anim => {
        const entry = document.createElement('div');
        entry.className = 'cam-anim-entry';
        entry.id = 'cam-anim-' + anim.id;
        entry.innerHTML = `
          <span class="cam-anim-name" style="color:${anim.color}">${anim.name}</span>
          <span class="cam-anim-loc" id="cam-loc-${anim.id}">${ROOMS[anim.defaultRoom]?.name || '???'}</span>
        `;
        animList.appendChild(entry);
      });
    }

    switchCamera(0);
  }

  function switchCamera(index) {
    currentCam = index;
    const cam = CAMERAS[index];
    if (!cam) return;

    // Update active button
    document.querySelectorAll('.cam-btn').forEach((b, i) => {
      b.classList.toggle('active', i === index);
    });

    // Set feed background
    const feed = document.getElementById('cam-feed');
    const room = ROOMS[cam.room];
    if (feed && room && room.bg) {
      feed.style.backgroundImage = `url('${room.bg}')`;
      feed.style.backgroundSize = 'cover';
      feed.style.backgroundPosition = 'center';
    }

    // Label
    const label = document.getElementById('cam-label-overlay');
    if (label) label.textContent = cam.label;

    // Show animatronic if present
    const overlay = document.getElementById('cam-animatronic-overlay');
    if (overlay) {
      overlay.innerHTML = '';
      cam.animatronics.forEach(animId => {
        const anim = ANIMATRONICS[animId];
        if (anim) {
          const img = document.createElement('img');
          img.src = anim.img;
          img.style.maxHeight = '70%';
          img.style.opacity = '0.7';
          img.style.filter = 'brightness(0.5) contrast(1.3) sepia(0.3)';
          overlay.appendChild(img);
        }
      });
    }
  }

  function openCameras() {
    buildCameraUI();
    document.getElementById('ui-cameras').classList.remove('hidden');
    Audio.startAmbient('default');
  }

  function closeCameras() {
    document.getElementById('ui-cameras').classList.add('hidden');
  }

  // ── EXTRAS SCREEN ──
  function buildExtras() {
    const grid = document.getElementById('extras-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.values(ANIMATRONICS).forEach(anim => {
      const card = document.createElement('div');
      card.className = 'extras-card';
      card.innerHTML = `
        <img src="${anim.img}" alt="${anim.name}" />
        <div class="extras-card-name">${anim.name}</div>
      `;
      grid.appendChild(card);
    });
  }

  // ── NIGHT SELECT ──
  function buildNightSelect(unlockedNights) {
    const grid = document.getElementById('night-grid');
    if (!grid) return;
    grid.innerHTML = '';
    NIGHTS.forEach((night, i) => {
      const card = document.createElement('div');
      const locked = (i + 1) > unlockedNights;
      card.className = 'night-card' + (locked ? ' locked' : '');
      card.innerHTML = `
        <span class="night-card-number">${locked ? '🔒' : (i + 1)}</span>
        <span class="night-card-label">${locked ? 'LOCKED' : night.title.toUpperCase()}</span>
        ${!locked ? `<span class="night-card-label" style="color:#666;font-size:0.6rem">${night.subtitle}</span>` : ''}
      `;
      if (!locked) {
        card.addEventListener('click', () => {
          Audio.playClick();
          Game.startNight(i);
        });
      }
      grid.appendChild(card);
    });
  }

  // ── VIGNETTE + STATIC ──
  function addAmbientEffects() {
    if (!document.querySelector('.vignette')) {
      const v = document.createElement('div');
      v.className = 'vignette';
      document.body.appendChild(v);
    }
    if (!document.querySelector('.static-noise')) {
      const s = document.createElement('div');
      s.className = 'static-noise';
      document.body.appendChild(s);
    }
  }

  return {
    showScreen, toast, typewrite, setRoom, showGameUI, hideAllGameUI,
    showAnimatronic, flashLight, showDialogue, advanceDialogue, hideDialogue,
    setHudNight, setHudMsg, showHUD, hideHUD,
    openCameras, closeCameras, buildExtras, buildNightSelect, addAmbientEffects
  };
})();
