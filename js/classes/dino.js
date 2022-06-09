import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty
} from '../util/updateCustomProperty.js';

const dinoElem = document.querySelector('[data-dino]');
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 4;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
const selectedDino = 'sammy1';

export const setupDino = () => {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, '--bottom', 0);
  document.removeEventListener('keydown', onJump);
  document.addEventListener('keydown', onJump);
};

export const updateDino = (delta, speedScale) => {
  handleRun(delta, speedScale);
  handleJump(delta);
};

export const getDinoRect = () => dinoElem.getBoundingClientRect();

export const setDinoLose = () => {
  dinoElem.src = `assets/dinos/${selectedDino}/dino-dead.png`;
};

const handleRun = (delta, speedScale) => {
  if (isJumping) {
    dinoElem.src = `assets/dinos/${selectedDino}/dino-stationary.png`;
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `assets/dinos/${selectedDino}/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }

  currentFrameTime += delta * speedScale;
};

const handleJump = delta => {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, '--bottom', yVelocity * delta);

  if (getCustomProperty(dinoElem, '--bottom') <= 0) {
    setCustomProperty(dinoElem, '--bottom', 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

const onJump = e => {
  if (e.keyCode !== 32 || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
};