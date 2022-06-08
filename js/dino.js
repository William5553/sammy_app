import { updateGround, setupGround } from './classes/ground.js';
import { updateDino, setupDino, getDinoRect, setDinoLose } from './classes/dino.js';
import { updateCactus, setupCactus, getCactusRects } from './classes/cactus.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const startScreenElem = document.querySelector('[data-start-screen]');

let lastTime;
let speedScale;
let score;

const update = time => {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
};

const checkLose = () => {
  const dinoRect = getDinoRect();
  return getCactusRects().some(rect => isCollision(rect, dinoRect));
};

const isCollision = (rect1, rect2) => {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
};

const updateSpeedScale = delta => {
  speedScale += delta * SPEED_SCALE_INCREASE;
};

const updateScore = delta => {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
};

const handleStart = () => {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add('hide');
  window.requestAnimationFrame(update);
};

const handleLose = () => {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener('keydown', handleStart, { once: true });
    startScreenElem.classList.remove('hide');
  }, 100);
};

const setPixelToWorldScale = () => {
  const worldToPixelScale = window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT ? window.innerWidth / WORLD_WIDTH : window.innerHeight / WORLD_HEIGHT;

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
};

setPixelToWorldScale();
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart, { once: true });