import { updateGround, setupGround } from './classes/ground.js';
import { updateDino, setupDino, getDinoRect, setDinoLose, updateDinoImg } from './classes/dino.js';
import { updateCactus, setupCactus, getCactusRects } from './classes/cactus.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 35;
const SPEED_SCALE_INCREASE = 0.000015;

const AVAILABLE_CHARACTERS = {
  default: 0,
  yung: 250
};

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const startScreenElem = document.querySelector('[data-start-screen]');
const headerElem = document.querySelector('#header');
const shopButtonElem = document.querySelector('#shopButton');
const shopElem = document.querySelector('[data-shop]');

let lastTime;
let speedScale;
let score = 0;
let highScore = localStorage.getItem('highScore') ?? 0;
let currentChar = localStorage.getItem('currentChar') ?? 'default';
let raqId;
let tabbedOut = false;

// TODO: icons for main and dino

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
  if (e instanceof KeyboardEvent && e.code !== 'Space') return;
  if (e.type === 'click' && (e.composedPath().includes(headerElem) || e.composedPath().includes(shopElem))) return;

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

const updateShop = () => {
  for (const [character, requirement] of Object.entries(AVAILABLE_CHARACTERS)) {
    const clone = document.querySelector(`#char-${character}`);

    const charImg = clone.querySelector('.shop-img');
    const reqText = clone.querySelector('.shop-req');
    const equipButton = clone.querySelector('.btn-equip');

    equipButton.classList.add(highScore >= requirement ? 'btn-primary' : 'btn-danger');
    equipButton.disabled = highScore < requirement || currentChar === character;
    equipButton.textContent = highScore >= requirement ? (currentChar === character ? 'Equipped' : 'Equip') : 'LOCKED';
    charImg.src = `assets/dinos/${character}/dino-stationary.png`;
    charImg.alt = character;
    reqText.textContent = `HIGH SCORE: ${requirement}`;
  }
};

const template = document.querySelector('#char-template');
const setupShop = () => {
  if (template)
   template.remove();

  if (localStorage.getItem('currentChar') == undefined)
    localStorage.setItem('currentChar', 'default');

  for (const [character, requirement] of Object.entries(AVAILABLE_CHARACTERS)) {
    if (document.querySelector(`#char-${character}`)) return;

    const clone = template.cloneNode(true);
    clone.id = `char-${character}`;

    const equipButton = clone.querySelector('.btn-equip');
    equipButton.addEventListener('click', () => {
      currentChar = character;
      localStorage.setItem('currentChar', character);
      updateDinoImg(character);
      updateShop();
    });

    shopElem.appendChild(clone);
  }
  updateShop();
};

shopButtonElem.addEventListener('click', () => {
  shopElem.classList.toggle('hide');
});

updateScoreText();
setPixelToWorldScale();
setupShop();
updateDinoImg(currentChar);
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('keydown', handleStart);
document.addEventListener('click', handleStart);
document.addEventListener('visibilitychange', onVisibilityChange);