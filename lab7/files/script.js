'use strict';

// ============================================================
// СТАН ГРИ
// ============================================================
let state = {
  level: 1,
  score: 0,
  phase: 'menu',      // menu | walking | waiting | duel | result
  fireTime: null,     // момент коли з'явився FIRE (мс)
  playerTime: null,   // час реакції гравця
  gunmanTime: null,   // час реакції ганнсмена (залежить від рівня)
  roundTimerId: null, // id setTimeout для пострілу ганнсмена
};

// ============================================================
// ЧИСТІ ФУНКЦІЇ
// ============================================================

// Рахує час реакції ганнсмена залежно від рівня (менше = складніше)
const calcGunmanReactionTime = (level) =>
  Math.max(300, 1200 - (level - 1) * 120); // мінімум 300мс

// Рахує очки за раунд
const calcRoundScore = (level) => level * 100;

// Форматує мілісекунди в "0.00"
const formatTime = (ms) =>
  ms === null ? '—' : (ms / 1000).toFixed(2);

// Оновлює стан без мутації
const updateState = (patch) => {
  state = { ...state, ...patch };
};

// ============================================================
// DOM — елементи
// ============================================================
const $ = (id) => document.getElementById(id);

const elMenu      = $('menu');
const elGame      = $('game');
const elGameover  = $('gameover');
const elGunman    = $('gunman');
const elGunBody   = $('gunman-body');
const elField     = $('field');
const elMsgFire   = $('msg-fire');
const elMsgResult = $('msg-result');
const elCrosshair = $('crosshair');
const elBtnStart  = $('btn-start');
const elBtnRestart= $('btn-restart');
const elBtnNext   = $('btn-next');
const elBtnAgain  = $('btn-again');
const elYouTime   = $('you-time');
const elGunTime   = $('gun-time');
const elLevelNum  = $('level-num');
const elScoreNum  = $('score-num');
const elFinalNum  = $('final-num');

// ============================================================
// ПРИЦІЛЬНИК — слідує за мишею
// ============================================================
document.addEventListener('mousemove', (e) => {
  elCrosshair.style.left = e.clientX + 'px';
  elCrosshair.style.top  = e.clientY + 'px';
});

// ============================================================
// ЗВУК
// ============================================================
const playSound = (src) => {
  const audio = new Audio(src);
  audio.play().catch(() => {}); // ігноруємо помилку якщо браузер блокує
};

// ============================================================
// ПОКАЗ/ХОВАННЯ ЕКРАНІВ
// ============================================================
const showScreen = (screenEl) => {
  [elMenu, elGame, elGameover].forEach(el => el.classList.add('hidden'));
  screenEl.classList.remove('hidden');
};

// ============================================================
// ОНОВЛЕННЯ ПАНЕЛІ
// ============================================================
const updatePanel = () => {
  elLevelNum.textContent = state.level;
  elScoreNum.textContent = state.score;
  elYouTime.textContent  = formatTime(state.playerTime);
  elGunTime.textContent  = formatTime(state.gunmanTime);
};

// ============================================================
// ВСТАНОВИТИ СТАН ГАНСМЕНА
// ============================================================
const setGunmanState = (stateName) => {
  elGunman.className = stateName; // walking | standing | ready | shooting | dead
};

// ============================================================
// startGame — початок нової гри (з рівня 1)
// ============================================================
const startGame = () => {
  updateState({ level: 1, score: 0, phase: 'menu' });
  showScreen(elGame);
  updatePanel();
  startRound();
};

// ============================================================
// startRound — починає новий раунд
// ============================================================
const startRound = () => {
  // Ховаємо кнопки і повідомлення
  elBtnRestart.classList.add('hidden');
  elBtnNext.classList.add('hidden');
  elMsgFire.classList.add('hidden');
  elMsgResult.classList.add('hidden');
  elMsgResult.className = 'msg msg-result hidden';
  elField.classList.remove('death-flash');

  updateState({
    phase: 'walking',
    fireTime: null,
    playerTime: null,
    gunmanTime: null,
  });

  updatePanel();
  moveGunman();
};

// ============================================================
// moveGunman — гансмен виходить з правого краю на центр
// ============================================================
const moveGunman = () => {
  // Вибираємо рандомний емодзі-персонаж (Advanced: новий персонаж кожен раунд)
  const characters = ['🤠', '👮', '🥷', '🧙', '🤺'];
  elGunBody.textContent = characters[Math.floor(Math.random() * characters.length)];

  // Скидаємо позицію — за правим краєм
  elGunman.style.transition = 'none';
  elGunman.style.left = '110%';
  setGunmanState('walking');

  // Через один кадр запускаємо transition (щоб браузер побачив зміну)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      elGunman.style.transition = 'left 3s linear';
      elGunman.style.left = '42%'; // центр поля

      // Коли дійшов — зупиняємось і готуємось до дуелі
      elGunman.addEventListener('transitionend', onGunmanArrived, { once: true });
    });
  });
};

// ============================================================
// onGunmanArrived — гансмен дійшов до центру
// ============================================================
const onGunmanArrived = () => {
  setGunmanState('standing');
  updateState({ phase: 'waiting' });

  // Чекаємо рандомний час 1-3 секунди, потім починається дуель
  const waitTime = 1000 + Math.random() * 2000;
  setTimeout(prepareForDuel, waitTime);
};

// ============================================================
// prepareForDuel — починається дуель: показуємо FIRE
// ============================================================
const prepareForDuel = () => {
  if (state.phase !== 'waiting') return;

  setGunmanState('ready');
  elMsgFire.classList.remove('hidden');
  playSound('sounds/fire.m4a');

  updateState({
    phase: 'duel',
    fireTime: Date.now(),
  });

  // Встановлюємо таймер — через N мс гансмен стріляє сам
  const gunmanReaction = calcGunmanReactionTime(state.level);
  const timerId = setTimeout(() => gunmanShootsPlayer(gunmanReaction), gunmanReaction);
  updateState({ roundTimerId: timerId });
};

// ============================================================
// gunmanShootsPlayer — гансмен встиг першим
// ============================================================
const gunmanShootsPlayer = (reactionMs) => {
  if (state.phase !== 'duel') return;

  updateState({
    phase: 'result',
    gunmanTime: reactionMs,
    playerTime: null, // гравець не встиг
  });

  setGunmanState('shooting');
  elField.classList.add('death-flash');
  elMsgFire.classList.add('hidden');

  showResult(false);
};

// ============================================================
// playerShootsGunman — гравець клікнув по гансмену
// ============================================================
const playerShootsGunman = () => {
  if (state.phase !== 'duel') return;

  // Скасовуємо таймер ганнсмена
  clearTimeout(state.roundTimerId);

  const reactionMs = Date.now() - state.fireTime;
  const gunmanReaction = calcGunmanReactionTime(state.level);

  updateState({
    phase: 'result',
    playerTime: reactionMs,
    gunmanTime: gunmanReaction,
  });

  setGunmanState('dead');
  elMsgFire.classList.add('hidden');

  showResult(true);
};

// ============================================================
// showResult — показуємо результат раунду
// ============================================================
const showResult = (playerWon) => {
  updatePanel();

  if (playerWon) {
    const earned = calcRoundScore(state.level);
    updateState({ score: state.score + earned });
    updatePanel();

    elMsgResult.textContent = `YOU WIN! +$${earned}`;
    elMsgResult.classList.add('win');
    elMsgResult.classList.remove('hidden');

    // Показуємо кнопку "Наступний рівень"
    elBtnNext.classList.remove('hidden');
  } else {
    elMsgResult.textContent = 'YOU LOSE!';
    elMsgResult.classList.add('lose');
    elMsgResult.classList.remove('hidden');

    // Показуємо кнопку "Рестарт" і через час — gameover
    elBtnRestart.classList.remove('hidden');

    setTimeout(() => {
      elFinalNum.textContent = state.score;
      showScreen(elGameover);
    }, 3000);
  }
};

// ============================================================
// nextLevel — переходимо на наступний рівень
// ============================================================
const nextLevel = () => {
  updateState({ level: state.level + 1 });
  startRound();
};

// ============================================================
// restartGame — перезапуск з поточного рівня
// ============================================================
const restartGame = () => {
  clearTimeout(state.roundTimerId);
  startRound();
};

// ============================================================
// scoreCount — повертає поточний рахунок (pure)
// ============================================================
const scoreCount = (score, level) => score + calcRoundScore(level);

// ============================================================
// ОБРОБНИКИ ПОДІЙ
// ============================================================

// Клік по гансмену — гравець стріляє
elGunman.addEventListener('click', (e) => {
  e.stopPropagation();
  playerShootsGunman();
});

// Клік по полю під час дуелі — але НЕ по гансмену = промах
// (якщо phase === 'duel' і клік не по гансмену — нічого не робимо,
//  гансмен все одно вистрілить за своїм таймером)

// Кнопки
elBtnStart.addEventListener('click', startGame);
elBtnRestart.addEventListener('click', restartGame);
elBtnNext.addEventListener('click', nextLevel);
elBtnAgain.addEventListener('click', startGame);
