import { updateGround, setupGround } from './classes/ground.js';
import { updateDino, setupDino, getDinoRect, setDinoLose } from './classes/dino.js';
import { updateCactus, setupCactus, getCactusRects } from './classes/cactus.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 35;
const SPEED_SCALE_INCREASE = 0.000015;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const startScreenElem = document.querySelector('[data-start-screen]');

let lastTime;
let speedScale;
let score = 0;
let highScore = localStorage.getItem('highScore') ?? 0;
let raqId;
let tabbedOut = false;

// TODO: unlock new characters with high score, icons for main and dino

const update = time => {
  const delta = time - (lastTime ?? time);

  if (!tabbedOut) {
    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);
  }

  if (checkLose())
    return handleLose();

  lastTime = time;
  requestAnimationFrame(update);
};

const checkLose = () => {
  const dinoRect = getDinoRect();
  return getCactusRects().some(rect => isCollision(rect, dinoRect));
};

const isCollision = (rect1, rect2) => rect1.left < rect2.right && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.bottom > rect2.top;

const updateSpeedScale = delta => {
  speedScale += delta * SPEED_SCALE_INCREASE;
};

const updateScoreText = () => {
  scoreElem.textContent = `HI ${Math.floor(highScore)} | SCORE ${Math.floor(score)}`;
};

const updateScore = delta => {
  score += delta * 0.01;
  updateScoreText();
};

const handleStart = e => {
  if (e instanceof KeyboardEvent && e.code !== "Space") return;

  document.removeEventListener('keydown', handleStart);
  document.removeEventListener('click', handleStart);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  lastTime = undefined;
  speedScale = 1;
  score = 0;

  setupGround();
  setupDino();
  setupCactus();
  
  startScreenElem.classList.add('hide');
  requestAnimationFrame(update);
};

const handleLose = () => {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener('keydown', handleStart);
    document.addEventListener('click', handleStart);
    startScreenElem.classList.remove('hide');
  }, 100);
};

const setPixelToWorldScale = () => {
  const worldToPixelScale = window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT ? window.innerWidth / WORLD_WIDTH : window.innerHeight / WORLD_HEIGHT;

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
};

const onVisibilityChange = e => {
  if (document.hidden || document.webkitHidden || e.type == 'blur' || document.visibilityState != 'visible') {
    tabbedOut = true;
    cancelAnimationFrame(raqId);
    raqId = 0;
  } else {
    setTimeout(() => {
      tabbedOut = false;
    }, 100);
  }
};

updateScoreText();
setPixelToWorldScale();
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart);
document.addEventListener('click', handleStart);
document.addEventListener('visibilitychange', onVisibilityChange);