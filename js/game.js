/* ═══════════════════════════════════════════
   FNAF: SISTER LOCATION — FANMADE
   Main Game Controller
═══════════════════════════════════════════ */

const Game = (() => {

  let currentNightIndex = 0;
  let currentPhaseIndex = 0;
  let currentNightData  = null;
  let gameOverActive    = false;

  // ── INIT ──
  function init() {
    UI.addAmbientEffects();
    setupTitleButtons();
    showLoadingScreen();
  }

  // ── LOADING SCREEN ──
  function showLoadingScreen() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-title">SISTER LOCATION</div>
      <div class="loading-bar-wrap"><div class="loading-bar" id="loading-bar"></div></div>
      <div class="loading-text" id="loading-text">INITIALIZING SYSTEMS...</div>
    `;
    document.body.appendChild(overlay);

    const bar  = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    const msgs = [
      'LOADING ANIMATRONICS...',
      'INITIALIZING HANDUNIT...',
      'CALIBRATING SHOCK SYSTEMS...',
      'CHECKING BALLORA GALLERY...',
      'SYSTEM READY',
    ];
    let pct = 0;
    let msgIdx = 0;

    const interval = setInterval(() => {
      pct += 4;
      bar.style.width = Math.min(pct, 100) + '%';
      if (pct % 20 === 0 && msgIdx < msgs.length) {
        text.textContent = msgs[msgIdx++];
      }
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          overlay.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(overlay);
            UI.showScreen('title');
          }, 500);
        }, 600);
      }
    }, 50);
  }

  // ── TITLE SCREEN BUTTONS ──
  function setupTitleButtons() {
    document.getElementById('btn-newgame').addEventListener('click', () => {
      Audio.playClick();
      Audio.init();
      startNight(0);
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
      Audio.playClick();
      Audio.init();
      const save = getSave();
      const nightIdx = Math.max(0, save.unlockedNights - 1);
      UI.buildNightSelect(save.unlockedNights);
      UI.showScreen('nightselect');
    });

    document.getElementById('btn-extras').addEventListener('click', () => {
      Audio.playClick();
      UI.buildExtras();
      UI.showScreen('extras');
    });

    document.getElementById('btn-howtoplay').addEventListener('click', () => {
      Audio.playClick();
      UI.showScreen('howtoplay');
    });

    document.getElementById('btn-howtoplay-back').addEventListener('click', () => {
      Audio.playClick();
      UI.showScreen('title');
    });

    document.getElementById('btn-extras-back').addEventListener('click', () => {
      Audio.playClick();
      UI.showScreen('title');
    });

    document.getElementById('btn-nightselect-back').addEventListener('click', () => {
      Audio.playClick();
      UI.showScreen('title');
    });

    // Camera buttons
    document.getElementById('btn-cameras').addEventListener('click', () => {
      Audio.playClick();
      UI.openCameras();
    });

    document.getElementById('btn-cam-close').addEventListener('click', () => {
      Audio.playClick();
      UI.closeCameras();
    });

    document.getElementById('btn-vent').addEventListener('click', () => {
      Audio.playClick();
      UI.toast('Vent system is sealed during this shift.', 'warn', 2000);
    });

    // Dialogue next button
    document.getElementById('dialogue-next').addEventListener('click', () => {
      Audio.playClick();
      UI.advanceDialogue();
    });

    // Night complete buttons
    document.getElementById('btn-next-night').addEventListener('click', () => {
      Audio.playClick();
      const nextIdx = currentNightIndex + 1;
      if (nextIdx < NIGHTS.length) {
        startNight(nextIdx);
      } else {
        showWinScreen();
      }
    });

    document.getElementById('btn-complete-menu').addEventListener('click', () => {
      Audio.playClick();
      Audio.stopAmbient();
      UI.showScreen('title');
    });

    document.getElementById('btn-retry').addEventListener('click', () => {
      Audio.playClick();
      gameOverActive = false;
      startNight(currentNightIndex);
    });

    document.getElementById('btn-win-menu').addEventListener('click', () => {
      Audio.playClick();
      Audio.stopAmbient();
      UI.showScreen('title');
    });
  }

  // ── START NIGHT ──
  function startNight(nightIndex) {
    currentNightIndex = nightIndex;
    currentPhaseIndex = 0;
    gameOverActive    = false;
    currentNightData  = NIGHTS[nightIndex];

    UI.hideAllGameUI();
    UI.hideDialogue();
    UI.showAnimatronic(null, false);
    Audio.stopAmbient();

    // Show elevator / intro
    UI.showScreen('elevator');
    const nightLabel = document.getElementById('night-label');
    if (nightLabel) nightLabel.textContent = currentNightData.title.toUpperCase();

    const handunitText = document.getElementById('handunit-text');
    const handunitNext = document.getElementById('handunit-next');
    const inputArea    = document.getElementById('handunit-input-area');

    if (handunitText) {
      handunitText.innerHTML = '';
      UI.typewrite(handunitText,
        `Welcome to ${currentNightData.title}. Connecting to HandUnit...`,
        30,
        () => {
          if (handunitNext) {
            handunitNext.style.display = 'block';
            handunitNext.onclick = () => {
              Audio.playClick();
              handunitNext.style.display = 'none';
              beginNightPhases();
            };
          }
        }
      );
    }
  }

  // ── RUN NIGHT PHASES ──
  function beginNightPhases() {
    UI.showScreen('game');
    UI.setHudNight(currentNightData.number);
    UI.showHUD();
    Audio.startAmbient('default');
    runPhase(0);
  }

  function runPhase(index) {
    if (gameOverActive) return;
    currentPhaseIndex = index;
    const night = currentNightData;
    if (!night || index >= night.phases.length) {
      nightComplete();
      return;
    }

    const phase = night.phases[index];
    const next  = () => runPhase(index + 1);

    switch (phase.type) {

      case 'dialogue':
        UI.hideAllGameUI();
        UI.showScreen('game');
        UI.showDialogue(phase.speaker, phase.lines, next);
        break;

      case 'name_input':
        showNameInput(next);
        break;

      case 'pcm':
        UI.showScreen('game');
        Nights.runPCM(phase.tasks, next);
        break;

      case 'circus_control':
        UI.showScreen('game');
        Nights.runCircusControl(phase.shocksNeeded || 3, next);
        break;

      case 'hide_desk':
        UI.showScreen('game');
        Nights.runHideDesk(next);
        break;

      case 'ballora_crawl':
        UI.showScreen('game');
        Nights.runBalloraCrawl(false, next);
        break;

      case 'ballora_crawl_return':
        UI.showScreen('game');
        Nights.runBalloraCrawl(true, next);
        break;

      case 'breaker_room':
        UI.showScreen('game');
        Nights.runBreakerRoom(next);
        break;

      case 'parts_service':
        UI.showScreen('game');
        Nights.runPartsService(next);
        break;

      case 'ft_auditorium_walk':
        UI.showScreen('game');
        Nights.runFTWalk(false, next);
        break;

      case 'ft_auditorium_walk_return':
        UI.showScreen('game');
        Nights.runFTWalk(true, next);
        break;

      case 'private_room':
        UI.showScreen('game');
        Nights.runPrivateRoom(next);
        break;

      case 'night_complete':
        nightComplete();
        break;

      default:
        next();
    }
  }

  // ── NAME INPUT ──
  function showNameInput(onDone) {
    const handunitText  = document.getElementById('handunit-text');
    const inputArea     = document.getElementById('handunit-input-area');
    const handunitNext  = document.getElementById('handunit-next');
    const inputEl       = document.getElementById('handunit-input');
    const submitBtn     = document.getElementById('handunit-submit');

    // Show elevator screen briefly for name input
    UI.showScreen('elevator');
    document.getElementById('night-label').textContent = currentNightData.title.toUpperCase();

    if (handunitText) {
      handunitText.textContent = 'Please enter your name using the keypad below.';
    }
    if (inputArea) inputArea.style.display = 'flex';
    if (handunitNext) handunitNext.style.display = 'none';

    const handleSubmit = () => {
      Audio.playClick();
      const typed = inputEl ? inputEl.value.trim() : '';
      const corrected = currentNightData.handunitName || 'Eggs Benedict';

      if (inputArea) inputArea.style.display = 'none';
      if (handunitText) {
        UI.typewrite(handunitText,
          `It seems you had some trouble with the keypad. I will auto-correct it for you.\n\nWelcome: ${corrected}.`,
          30,
          () => {
            if (handunitNext) {
              handunitNext.style.display = 'block';
              handunitNext.onclick = () => {
                Audio.playClick();
                handunitNext.style.display = 'none';
                UI.showScreen('game');
                onDone();
              };
            }
          }
        );
      }
    };

    if (submitBtn) {
      const newBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newBtn, submitBtn);
      newBtn.addEventListener('click', handleSubmit);
    }

    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
      const newInput = inputEl.cloneNode(true);
      inputEl.parentNode.replaceChild(newInput, inputEl);
      newInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleSubmit();
      });
    }
  }

  // ── NIGHT COMPLETE ──
  function nightComplete() {
    if (gameOverActive) return;
    Audio.stopAmbient();
    Audio.playSuccess();

    unlockNight(currentNightIndex + 2);

    UI.hideAllGameUI();
    UI.hideHUD();
    UI.hideDialogue();
    UI.showAnimatronic(null, false);

    // Populate complete screen
    const titleEl = document.getElementById('complete-title');
    if (titleEl) titleEl.textContent = currentNightData.title.toUpperCase() + ' COMPLETE';

    const tvEl = document.getElementById('tv-dialogue');
    if (tvEl) tvEl.innerHTML = TV_DIALOGUES[currentNightIndex] || '';

    const nextBtn = document.getElementById('btn-next-night');
    if (nextBtn) {
      nextBtn.style.display = currentNightIndex < NIGHTS.length - 1 ? 'block' : 'none';
    }

    UI.showScreen('complete');
  }

  // ── GAME OVER / JUMPSCARE ──
  function triggerGameOver(animId) {
    if (gameOverActive) return;
    gameOverActive = true;

    Audio.stopAmbient();
    Audio.playJumpscare();

    const anim = ANIMATRONICS[animId];
    const jsBg = document.getElementById('jumpscare-bg');
    if (jsBg && anim) {
      jsBg.style.backgroundImage = `url('${anim.img}')`;
      jsBg.style.backgroundSize  = 'contain';
      jsBg.style.backgroundPosition = 'center';
      jsBg.style.backgroundRepeat   = 'no-repeat';
      jsBg.style.backgroundColor    = '#000';
    }

    const jsText = document.getElementById('jumpscare-text');
    if (jsText) jsText.textContent = (anim ? anim.name.toUpperCase() : 'GAME OVER');

    UI.showScreen('jumpscare');
  }

  // ── WIN SCREEN ──
  function showWinScreen() {
    Audio.stopAmbient();
    const winAnimEl = document.getElementById('win-animatronics');
    if (winAnimEl) {
      winAnimEl.innerHTML = '';
      Object.values(ANIMATRONICS).forEach(anim => {
        const img = document.createElement('img');
        img.src = anim.img;
        img.alt = anim.name;
        img.title = anim.name;
        winAnimEl.appendChild(img);
      });
    }
    UI.showScreen('win');
  }

  return { init, startNight, triggerGameOver };
})();

// ── BOOT ──
window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
