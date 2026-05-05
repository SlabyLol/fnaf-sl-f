/* ═══════════════════════════════════════════
   FNAF: SISTER LOCATION — FANMADE
   Night Phase Logic
═══════════════════════════════════════════ */

const Nights = (() => {

  let currentNight = null;
  let currentPhaseIndex = 0;
  let phaseCallback = null;

  // ── PCM (Primary Control Module) Phase ──
  function runPCM(tasks, onDone) {
    UI.setRoom('pcm');
    UI.showGameUI('pcm');
    UI.showHUD();
    Audio.startAmbient('default');

    let taskIndex = 0;
    let lightChecksLeft = tasks[0].lightChecks;
    let shocksLeft = tasks[0].shocksNeeded;
    let taskDone = [false, false];

    function updateWindows() {
      const t = tasks[taskIndex];
      const anim = ANIMATRONICS[t.animatronic];
      // Left = Ballora, Right = Funtime Foxy
      const viewBallora = document.getElementById('view-ballora');
      const viewFoxy    = document.getElementById('view-funtime-foxy');
      if (viewBallora) viewBallora.style.backgroundImage = `url('${ROOMS.ballora_gallery.bg}')`;
      if (viewFoxy)    viewFoxy.style.backgroundImage    = `url('${ROOMS.ft_auditorium.bg}')`;
    }

    function checkTask() {
      if (taskDone[0] && taskDone[1]) {
        Audio.playSuccess();
        UI.toast('All animatronics confirmed on stage!', 'good', 2000);
        setTimeout(onDone, 1200);
      }
    }

    updateWindows();

    // Ballora controls
    const btnLightBallora = document.getElementById('btn-light-ballora');
    const btnShockBallora = document.getElementById('btn-shock-ballora');
    const btnLightFoxy    = document.getElementById('btn-light-foxy');
    const btnShockFoxy    = document.getElementById('btn-shock-foxy');

    let balloraChecks = 0;
    let balloraShocks = 0;
    let balloraOnStage = false;
    let foxyChecks = 0;
    let foxyShocks = 0;
    let foxyOnStage = false;

    const balloraTask = tasks.find(t => t.animatronic === 'ballora');
    const foxyTask    = tasks.find(t => t.animatronic === 'funtime_foxy');

    function newBtnLight(btn, fn) {
      const nb = btn.cloneNode(true);
      btn.parentNode.replaceChild(nb, btn);
      nb.addEventListener('click', fn);
      return nb;
    }

    let blb = newBtnLight(btnLightBallora, () => {
      Audio.playClick();
      UI.flashLight();
      balloraChecks++;
      if (!balloraOnStage) {
        if (balloraShocks >= (balloraTask ? balloraTask.shocksNeeded : 1)) {
          balloraOnStage = true;
          UI.showAnimatronic('ballora', true);
          UI.toast('Ballora is on stage!', 'good', 1500);
          taskDone[0] = true;
          checkTask();
        } else {
          UI.showAnimatronic('ballora', false);
          UI.toast("Ballora is not on stage. Administer a controlled shock.", 'warn', 2000);
        }
      }
    });

    let bsb = document.getElementById('btn-shock-ballora');
    const newBsb = bsb.cloneNode(true);
    bsb.parentNode.replaceChild(newBsb, bsb);
    newBsb.addEventListener('click', () => {
      if (balloraOnStage) { UI.toast('Ballora is already on stage.', '', 1500); return; }
      Audio.playShock();
      balloraShocks++;
      UI.toast('Controlled shock administered.', '', 1500);
    });

    let blfb = document.getElementById('btn-light-foxy');
    const newBlfb = blfb.cloneNode(true);
    blfb.parentNode.replaceChild(newBlfb, blfb);
    newBlfb.addEventListener('click', () => {
      Audio.playClick();
      UI.flashLight();
      foxyChecks++;
      if (!foxyOnStage) {
        if (foxyShocks >= (foxyTask ? foxyTask.shocksNeeded : 2)) {
          foxyOnStage = true;
          UI.showAnimatronic('funtime_foxy', true);
          UI.toast('Funtime Foxy is on stage!', 'good', 1500);
          taskDone[1] = true;
          checkTask();
        } else {
          UI.showAnimatronic('funtime_foxy', false);
          UI.toast("Funtime Foxy is not on stage. Administer a controlled shock.", 'warn', 2000);
        }
      }
    });

    let bsfb = document.getElementById('btn-shock-foxy');
    const newBsfb = bsfb.cloneNode(true);
    bsfb.parentNode.replaceChild(newBsfb, bsfb);
    newBsfb.addEventListener('click', () => {
      if (foxyOnStage) { UI.toast('Funtime Foxy is already on stage.', '', 1500); return; }
      Audio.playShock();
      foxyShocks++;
      UI.toast('Controlled shock administered.', '', 1500);
    });
  }

  // ── CIRCUS CONTROL Phase ──
  function runCircusControl(shocksNeeded, onDone) {
    UI.setRoom('circus_control');
    UI.showGameUI('cc');
    UI.showHUD();

    const viewBaby = document.getElementById('view-baby');
    if (viewBaby) viewBaby.style.backgroundImage = `url('${ROOMS.circus_control.bg}')`;

    let shocks = 0;
    let babyOnStage = false;

    const btnLightBaby = document.getElementById('btn-light-baby');
    const btnShockBaby = document.getElementById('btn-shock-baby');

    const newLight = btnLightBaby.cloneNode(true);
    btnLightBaby.parentNode.replaceChild(newLight, btnLightBaby);
    newLight.addEventListener('click', () => {
      Audio.playClick();
      UI.flashLight();
      if (!babyOnStage) {
        if (shocks >= shocksNeeded) {
          babyOnStage = true;
          UI.showAnimatronic('circus_baby', true);
          UI.toast('Circus Baby is on stage!', 'good', 1500);
          setTimeout(() => {
            UI.showAnimatronic('circus_baby', false);
            onDone();
          }, 1500);
        } else {
          UI.showAnimatronic('circus_baby', false);
          UI.toast("Baby is not on stage. Administer a controlled shock.", 'warn', 2000);
        }
      }
    });

    const newShock = btnShockBaby.cloneNode(true);
    btnShockBaby.parentNode.replaceChild(newShock, btnShockBaby);
    newShock.addEventListener('click', () => {
      if (babyOnStage) { UI.toast('Baby is already on stage.', '', 1500); return; }
      Audio.playShock();
      shocks++;
      UI.toast('Controlled shock administered.', '', 1500);
    });
  }

  // ── HIDE UNDER DESK Phase ──
  function runHideDesk(onDone) {
    UI.setRoom('pcm');
    UI.hideAllGameUI();
    Audio.startAmbient('danger');

    UI.toast('The lights go out. Something is in the vents...', 'warn', 3000);

    // Simulate Bidybab encounter
    let doorAttempts = 0;
    const maxAttempts = 3;

    setTimeout(() => {
      showBidybabEncounter();
    }, 3500);

    function showBidybabEncounter() {
      UI.showAnimatronic('bidybab', true);

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:50;
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;
      `;
      overlay.innerHTML = `
        <div style="font-family:'Share Tech Mono',monospace;color:#cc2222;font-size:1rem;letter-spacing:3px;text-align:center;">
          Something is trying to open the door...
        </div>
        <div style="font-family:'Share Tech Mono',monospace;color:#888;font-size:0.8rem;text-align:center;max-width:400px;line-height:1.6;">
          Circus Baby: "They will lose interest... just hold the door."
        </div>
        <button id="btn-hold-door" style="
          background:rgba(200,0,0,0.2);border:1px solid #cc2222;color:#ff4444;
          font-family:'Orbitron',sans-serif;font-size:0.8rem;letter-spacing:2px;
          padding:12px 32px;cursor:pointer;
        ">HOLD THE DOOR</button>
        <div id="door-status" style="font-family:'Share Tech Mono',monospace;color:#666;font-size:0.75rem;"></div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('btn-hold-door').addEventListener('click', () => {
        doorAttempts++;
        Audio.playClick();
        const status = document.getElementById('door-status');
        if (doorAttempts < maxAttempts) {
          status.textContent = `The door rattles again... (${doorAttempts}/${maxAttempts})`;
          status.style.color = '#ff8800';
        } else {
          status.textContent = "They're gone. Circus Baby says it's safe now.";
          status.style.color = '#22cc55';
          document.getElementById('btn-hold-door').disabled = true;
          setTimeout(() => {
            document.body.removeChild(overlay);
            UI.showAnimatronic('circus_baby', false);
            Audio.stopAmbient();
            onDone();
          }, 1800);
        }
      });
    }
  }

  // ── BALLORA GALLERY CRAWL Phase ──
  function runBalloraCrawl(isReturn, onDone) {
    UI.setRoom('ballora_gallery');
    UI.showGameUI('ballora-crawl');
    UI.showHUD();
    Audio.startAmbient('ballora');

    let progress = 0;
    let soundLevel = 0;
    let moving = false;
    let balloraAnger = 0;
    let gameOver = false;

    const progressFill = document.getElementById('crawl-progress-fill');
    const soundFill    = document.getElementById('crawl-sound-fill');
    const soundLabel   = document.getElementById('crawl-sound-label');
    const statusEl     = document.getElementById('crawl-status');

    const btnMove = document.getElementById('btn-crawl-move');
    const btnStop = document.getElementById('btn-crawl-stop');

    const newMove = btnMove.cloneNode(true);
    btnMove.parentNode.replaceChild(newMove, btnMove);
    const newStop = btnStop.cloneNode(true);
    btnStop.parentNode.replaceChild(newStop, btnStop);

    newMove.addEventListener('click', () => {
      if (gameOver) return;
      moving = true;
      soundLevel = Math.min(soundLevel + 25, 100);
      Audio.playBalloraMusic(soundLevel / 100 * 0.5);
      update();
    });

    newStop.addEventListener('click', () => {
      if (gameOver) return;
      moving = false;
      soundLevel = Math.max(soundLevel - 30, 0);
      update();
    });

    function update() {
      if (gameOver) return;

      if (moving) {
        progress = Math.min(progress + 8, 100);
        soundLevel = Math.min(soundLevel + 5, 100);
      } else {
        soundLevel = Math.max(soundLevel - 10, 0);
      }

      // Ballora anger based on sound
      if (soundLevel > 60) {
        balloraAnger += 15;
      } else if (soundLevel > 30) {
        balloraAnger += 5;
      } else {
        balloraAnger = Math.max(balloraAnger - 8, 0);
      }

      progressFill.style.width = progress + '%';
      soundFill.style.width = soundLevel + '%';
      soundFill.style.background = soundLevel > 60 ? '#cc2222' : soundLevel > 30 ? '#dd8800' : '#22cc55';

      if (soundLevel < 10) soundLabel.textContent = 'SILENT';
      else if (soundLevel < 40) soundLabel.textContent = 'QUIET';
      else if (soundLevel < 70) soundLabel.textContent = 'AUDIBLE';
      else soundLabel.textContent = 'TOO LOUD!';

      // Ballora status messages
      if (balloraAnger > 80) {
        statusEl.textContent = "Ballora: 'I can hear you... I know you're there...'";
        statusEl.style.color = '#ff4444';
      } else if (balloraAnger > 40) {
        statusEl.textContent = "Ballora: 'Is someone there...?'";
        statusEl.style.color = '#ff8800';
      } else {
        statusEl.textContent = isReturn ? "Almost back... keep going..." : "The breaker room is ahead...";
        statusEl.style.color = '#666688';
      }

      // Game over if anger maxes
      if (balloraAnger >= 100) {
        gameOver = true;
        Game.triggerGameOver('ballora');
        return;
      }

      // Occasional Ballora music
      if (Math.random() < 0.3 && soundLevel > 20) {
        Audio.playBalloraMusic((soundLevel / 100) * 0.4);
      }

      // Complete
      if (progress >= 100) {
        Audio.stopAmbient();
        Audio.playSuccess();
        UI.toast(isReturn ? 'You made it back safely!' : 'You reached the Breaker Room!', 'good', 2000);
        setTimeout(onDone, 1200);
      }
    }
  }

  // ── BREAKER ROOM Phase ──
  function runBreakerRoom(onDone) {
    UI.setRoom('breaker_room');
    UI.showGameUI('breaker');
    UI.showHUD();
    Audio.startAmbient('danger');

    const totalSwitches = 8;
    const correctOrder = Array.from({length: totalSwitches}, (_, i) => i);
    // Shuffle correct order
    for (let i = correctOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [correctOrder[i], correctOrder[j]] = [correctOrder[j], correctOrder[i]];
    }

    let nextCorrect = 0;
    let danger = 10;
    let dangerInterval = null;
    let bonBonCooldown = false;

    const switchContainer = document.getElementById('breaker-switches');
    const dangerFill  = document.getElementById('breaker-danger-fill');
    const dangerText  = document.getElementById('breaker-danger-text');
    const progressTxt = document.getElementById('breaker-progress-text');
    const statusEl    = document.getElementById('breaker-status');

    switchContainer.innerHTML = '';
    for (let i = 0; i < totalSwitches; i++) {
      const sw = document.createElement('div');
      sw.className = 'breaker-switch';
      sw.textContent = String(i + 1).padStart(2, '0');
      sw.dataset.index = i;
      sw.addEventListener('click', () => handleSwitch(i, sw));
      switchContainer.appendChild(sw);
    }

    function handleSwitch(idx, el) {
      if (el.classList.contains('done')) return;
      Audio.playSwitch();

      if (correctOrder[nextCorrect] === idx) {
        el.classList.add('done');
        nextCorrect++;
        progressTxt.textContent = `Switches restored: ${nextCorrect} / ${totalSwitches}`;
        statusEl.textContent = nextCorrect < totalSwitches
          ? `Good. ${totalSwitches - nextCorrect} remaining...`
          : 'Power restored!';

        if (nextCorrect >= totalSwitches) {
          clearInterval(dangerInterval);
          Audio.stopAmbient();
          Audio.playSuccess();
          UI.toast('Power restored! Freddy has calmed down.', 'good', 2000);
          setTimeout(onDone, 1500);
        }
      } else {
        el.classList.add('wrong');
        setTimeout(() => el.classList.remove('wrong'), 400);
        danger = Math.min(danger + 20, 100);
        statusEl.textContent = 'Wrong switch! Freddy is getting closer...';
        updateDanger();
      }
    }

    function updateDanger() {
      dangerFill.style.width = danger + '%';
      dangerFill.style.background = danger > 70 ? '#cc2222' : danger > 40 ? '#dd8800' : '#22cc55';
      dangerText.textContent = danger > 70 ? 'CRITICAL' : danger > 40 ? 'HIGH' : 'LOW';
      dangerText.style.color = danger > 70 ? '#ff4444' : danger > 40 ? '#ffaa00' : '#22cc55';

      if (danger >= 100) {
        clearInterval(dangerInterval);
        Game.triggerGameOver('funtime_freddy');
      }
    }

    // Danger rises over time
    dangerInterval = setInterval(() => {
      danger = Math.min(danger + 3, 100);
      updateDanger();
    }, 2000);

    // Bon-Bon button
    const btnBonBon = document.getElementById('btn-play-bonbon');
    const newBonBon = btnBonBon.cloneNode(true);
    btnBonBon.parentNode.replaceChild(newBonBon, btnBonBon);
    newBonBon.addEventListener('click', () => {
      if (bonBonCooldown) { UI.toast('Bon-Bon audio is recharging...', 'warn', 1500); return; }
      Audio.playBonBon();
      danger = Math.max(danger - 35, 5);
      updateDanger();
      statusEl.textContent = "Bon-Bon's audio has calmed Freddy... for now.";
      bonBonCooldown = true;
      newBonBon.disabled = true;
      setTimeout(() => {
        bonBonCooldown = false;
        newBonBon.disabled = false;
      }, 8000);
    });
  }

  // ── PARTS / SERVICE Phase ──
  function runPartsService(onDone) {
    UI.setRoom('parts_service');
    UI.showGameUI('parts');
    UI.showHUD();
    Audio.startAmbient('danger');

    UI.showAnimatronic('funtime_freddy', true);

    const steps = [
      { label: 'Open Freddy\'s chest cavity panel',   icon: '🔧', done: false },
      { label: 'Remove the power module',              icon: '🔋', done: false },
      { label: 'Locate Bon-Bon (puppet hand)',         icon: '🔍', done: false },
      { label: 'Deactivate Bon-Bon\'s hand unit',      icon: '⚡', done: false },
      { label: 'Reinstall the power module',           icon: '🔋', done: false },
      { label: 'Close and seal chest cavity',          icon: '🔒', done: false },
    ];

    let currentStep = 0;
    let danger = 5;
    let dangerInterval = null;
    let bonBonCooldown = false;

    const stepsContainer = document.getElementById('parts-steps');
    const dangerFill = document.getElementById('parts-danger-fill');
    const statusEl   = document.getElementById('parts-status');

    function renderSteps() {
      stepsContainer.innerHTML = '';
      steps.forEach((step, i) => {
        const el = document.createElement('div');
        el.className = 'parts-step' + (step.done ? ' done' : '') + (i > currentStep ? ' locked' : '');
        el.innerHTML = `
          <span class="parts-step-icon">${step.icon}</span>
          <span class="parts-step-label">${step.label}</span>
          <span class="parts-step-status">${step.done ? '✓ DONE' : i === currentStep ? '← CURRENT' : ''}</span>
        `;
        if (!step.done && i === currentStep) {
          el.addEventListener('click', () => {
            Audio.playClick();
            step.done = true;
            currentStep++;
            danger = Math.max(danger - 10, 5);
            statusEl.textContent = currentStep < steps.length
              ? `Step ${currentStep + 1}: ${steps[currentStep].label}`
              : 'Repair complete!';
            renderSteps();

            if (currentStep >= steps.length) {
              clearInterval(dangerInterval);
              Audio.stopAmbient();
              Audio.playSuccess();
              UI.showAnimatronic('funtime_freddy', false);
              UI.toast('Funtime Freddy has been repaired!', 'good', 2000);
              setTimeout(onDone, 1500);
            }
          });
        }
        stepsContainer.appendChild(el);
      });
    }

    renderSteps();

    function updateDanger() {
      dangerFill.style.width = danger + '%';
      dangerFill.style.background = danger > 70 ? '#cc2222' : danger > 40 ? '#dd8800' : '#22cc55';
      if (danger >= 100) {
        clearInterval(dangerInterval);
        Game.triggerGameOver('funtime_freddy');
      }
    }

    dangerInterval = setInterval(() => {
      danger = Math.min(danger + 4, 100);
      updateDanger();
    }, 2500);

    const btnBonBon = document.getElementById('btn-parts-bonbon');
    const newBonBon = btnBonBon.cloneNode(true);
    btnBonBon.parentNode.replaceChild(newBonBon, btnBonBon);
    newBonBon.addEventListener('click', () => {
      if (bonBonCooldown) { UI.toast('Bon-Bon is recharging...', 'warn', 1500); return; }
      Audio.playBonBon();
      danger = Math.max(danger - 40, 5);
      updateDanger();
      statusEl.textContent = 'Bon-Bon distracted Freddy. Continue the repair!';
      bonBonCooldown = true;
      newBonBon.disabled = true;
      setTimeout(() => { bonBonCooldown = false; newBonBon.disabled = false; }, 10000);
    });
  }

  // ── FUNTIME AUDITORIUM WALK Phase ──
  function runFTWalk(isReturn, onDone) {
    UI.setRoom('ft_auditorium');
    UI.showGameUI('ft-walk');
    UI.showHUD();
    Audio.startAmbient('default');

    let progress = 0;
    let foxyDanger = 0;
    let moving = false;
    let gameOver = false;

    const dangerFill   = document.getElementById('ftwalk-danger-fill');
    const progressFill = document.getElementById('ftwalk-progress-fill');
    const statusEl     = document.getElementById('ftwalk-status');

    const btnMove = document.getElementById('btn-ftwalk-move');
    const btnStop = document.getElementById('btn-ftwalk-stop');

    const newMove = btnMove.cloneNode(true);
    btnMove.parentNode.replaceChild(newMove, btnMove);
    const newStop = btnStop.cloneNode(true);
    btnStop.parentNode.replaceChild(newStop, btnStop);

    newMove.addEventListener('click', () => {
      if (gameOver) return;
      moving = true;
      foxyDanger = Math.min(foxyDanger + 15, 100);
      update();
    });

    newStop.addEventListener('click', () => {
      if (gameOver) return;
      moving = false;
      foxyDanger = Math.max(foxyDanger - 20, 0);
      update();
    });

    function update() {
      if (gameOver) return;
      if (moving) {
        progress = Math.min(progress + 10, 100);
        foxyDanger = Math.min(foxyDanger + 8, 100);
      } else {
        foxyDanger = Math.max(foxyDanger - 12, 0);
      }

      dangerFill.style.width = foxyDanger + '%';
      progressFill.style.width = progress + '%';

      if (foxyDanger > 70) {
        statusEl.textContent = "Funtime Foxy is RIGHT THERE — FREEZE!";
        statusEl.style.color = '#ff4444';
      } else if (foxyDanger > 40) {
        statusEl.textContent = "Funtime Foxy is nearby... move carefully.";
        statusEl.style.color = '#ff8800';
      } else {
        statusEl.textContent = isReturn ? "Heading back through the auditorium..." : "Moving through the auditorium...";
        statusEl.style.color = '#666688';
      }

      if (foxyDanger >= 100) {
        gameOver = true;
        Game.triggerGameOver('funtime_foxy');
        return;
      }

      if (progress >= 100) {
        Audio.stopAmbient();
        Audio.playSuccess();
        UI.toast(isReturn ? 'Made it back!' : 'Reached the other side!', 'good', 1500);
        setTimeout(onDone, 1000);
      }
    }
  }

  // ── PRIVATE ROOM Phase ──
  function runPrivateRoom(onDone) {
    UI.setRoom('private_room');
    UI.showGameUI('private');
    UI.showHUD();
    Audio.startAmbient('danger');

    UI.showAnimatronic('ennard', true);

    let power = 100;
    let timeHour = 0; // 0 = 12AM, 6 = 6AM
    let ennardPos = 'left'; // left, center, right
    let shockCooldown = false;
    let gameOver = false;
    let won = false;

    const timeLabels = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'];

    const timeEl   = document.getElementById('private-time');
    const powerFill = document.getElementById('private-power-fill');
    const powerPct  = document.getElementById('private-power-pct');
    const statusEl  = document.getElementById('private-status');

    const ennardLeft   = document.getElementById('ennard-left');
    const ennardCenter = document.getElementById('ennard-center');
    const ennardRight  = document.getElementById('ennard-right');

    function updateEnnardIndicator() {
      [ennardLeft, ennardCenter, ennardRight].forEach(el => el && el.classList.remove('active'));
      if (ennardPos === 'left'   && ennardLeft)   ennardLeft.classList.add('active');
      if (ennardPos === 'center' && ennardCenter) ennardCenter.classList.add('active');
      if (ennardPos === 'right'  && ennardRight)  ennardRight.classList.add('active');
    }

    function updatePower() {
      powerFill.style.width = power + '%';
      powerFill.style.background = power < 20 ? '#cc2222' : power < 40 ? '#dd8800' : '#22cc55';
      powerPct.textContent = Math.round(power) + '%';
      if (power < 20) {
        document.querySelector('.private-panel').classList.add('power-critical');
        Audio.playPowerLow();
      } else {
        document.querySelector('.private-panel').classList.remove('power-critical');
      }
    }

    // Time progression
    const timeInterval = setInterval(() => {
      if (gameOver || won) return;
      timeHour++;
      if (timeEl) timeEl.textContent = timeLabels[Math.min(timeHour, 6)];
      if (timeHour >= 6) {
        won = true;
        clearInterval(timeInterval);
        clearInterval(powerInterval);
        clearInterval(ennardInterval);
        Audio.stopAmbient();
        Audio.playSuccess();
        UI.showAnimatronic('ennard', false);
        UI.toast('6 AM! You survived the night!', 'good', 3000);
        setTimeout(onDone, 2500);
      }
    }, 12000); // 12s per hour = ~72s total

    // Power drain
    const powerInterval = setInterval(() => {
      if (gameOver || won) return;
      power = Math.max(power - 2, 0);
      updatePower();
      if (power <= 0) {
        gameOver = true;
        clearInterval(timeInterval);
        clearInterval(powerInterval);
        clearInterval(ennardInterval);
        Game.triggerGameOver('ennard');
      }
    }, 1500);

    // Ennard movement
    const positions = ['left', 'center', 'right'];
    const ennardInterval = setInterval(() => {
      if (gameOver || won) return;
      const idx = Math.floor(Math.random() * 3);
      ennardPos = positions[idx];
      updateEnnardIndicator();
      if (ennardPos === 'center') {
        statusEl.textContent = "ENNARD IS AT THE CENTER VENT — SHOCK NOW!";
        statusEl.style.color = '#ff4444';
      } else {
        statusEl.textContent = `Ennard is in the ${ennardPos} vent...`;
        statusEl.style.color = '#666688';
      }
    }, 4000);

    updateEnnardIndicator();

    // Recharge button
    const btnRecharge = document.getElementById('btn-private-recharge');
    const newRecharge = btnRecharge.cloneNode(true);
    btnRecharge.parentNode.replaceChild(newRecharge, btnRecharge);
    newRecharge.addEventListener('click', () => {
      if (gameOver || won) return;
      Audio.playClick();
      power = Math.min(power + 25, 100);
      updatePower();
      statusEl.textContent = 'Power recharged!';
    });

    // Shock button
    const btnShock = document.getElementById('btn-private-shock');
    const newShock = btnShock.cloneNode(true);
    btnShock.parentNode.replaceChild(newShock, btnShock);
    newShock.addEventListener('click', () => {
      if (gameOver || won || shockCooldown) return;
      Audio.playShock();
      if (ennardPos === 'center') {
        ennardPos = 'left';
        updateEnnardIndicator();
        statusEl.textContent = 'Ennard has been pushed back!';
        statusEl.style.color = '#22cc55';
        power = Math.max(power - 10, 0);
        updatePower();
      } else {
        statusEl.textContent = 'Ennard is not at the center vent!';
        statusEl.style.color = '#ff8800';
        power = Math.max(power - 5, 0);
        updatePower();
      }
      shockCooldown = true;
      newShock.disabled = true;
      setTimeout(() => { shockCooldown = false; newShock.disabled = false; }, 3000);
    });
  }

  return {
    runPCM,
    runCircusControl,
    runHideDesk,
    runBalloraCrawl,
    runBreakerRoom,
    runPartsService,
    runFTWalk,
    runPrivateRoom,
  };
})();
