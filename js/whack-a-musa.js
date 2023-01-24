// how often moles spawn in ms
const MOLE_RATE = {
  endlessEasy: 800,
  endlessMedium: 600,
  endlessHard: 400
};

// how long moles stay active in ms
const MOLE_LIFESPAN = {
  endlessEasy: 2500,
  endlessMedium: 2000,
  endlessHard: 1500
};

import { Mole } from './classes/Mole.js';

const moles = []; // array of all moles
let score = 0;
let gameActive = false;
let currentMode, currentMenu;

// html elements
const holeHolder = document.querySelector('#hole-holder');
const scoreText = document.querySelector('#score');
const timerText = document.querySelector('#timer');
const blur = document.querySelector('#blur');
const modeSelector = document.querySelector('#mode-selector');
const modeButtons = document.querySelectorAll('.modeButton');
const gameOverMenu = document.querySelector('#game-over');
const loseText = document.querySelector('#loseReason');
const playAgainButtons = document.querySelectorAll('.playAgainButton');

// gets the high score from local storage
const fetchHighScore = () => JSON.parse(localStorage.getItem('highScoreMusa')) ?? { [currentMode]: 0 };

// create a sleep function because javascript doesn't have one
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// get a random element from an array
const getRandom = array => array[Math.floor(Math.random() * array.length)];

// open a menu
const openMenu = menu => {
  if (currentMenu && currentMenu !== menu) // if there is already a menu open, close it
    closeMenus();
  else if (!currentMenu) // if there is no menu open, blur the background
    blur.classList.remove('hidden');
  menu.classList.remove('hidden'); // open the menu
  currentMenu = menu;
};

const closeMenus = () => {
  blur.classList.add('hidden'); // unblur the background
  currentMenu.classList.add('hidden'); // close the menu
  currentMenu = '';
};

const endGame = loseReason => {
  if (!gameActive) return;
  gameActive = false; // stop the game loop
  loseText.textContent = loseReason; // set the lose reason in the game over screen
  const highScore = fetchHighScore();
  // if there is no high score or the score is higher than the high score, set the high score
  if (!highScore[currentMode] || score > highScore[currentMode]) {
    highScore[currentMode] = score;
    localStorage.setItem('highScoreMusa', JSON.stringify(highScore));
  }
  openMenu(gameOverMenu); // open the game over screen
};

const lastMoles = []; // array of the last 3 moles that spawned
const startGame = async skipCountdown => {
  for (const mole of Object.values(moles))
    mole.setActive(false, 0);

  score = 0;
  updateScoreText();

  if (!skipCountdown) {
    // does a 3 second countdown before the game starts
    timerText.classList.remove('hidden');
    for (let i = 3; i > 0; i--) {
      timerText.textContent = i;
      await sleep(1000);
    }
    timerText.classList.add('hidden');
  }

  gameActive = true;
  // game loop
  while (gameActive) {
    // get all inactive moles
    const inactiveMoles = Object.values(moles).filter(mole => !mole.active && !mole.loseTimeout);
    let mole = getRandom(inactiveMoles); // get a random inactive mole
    while (lastMoles.includes(mole)) // make sure the same mole doesn't spawn twice in a row
      mole = getRandom(inactiveMoles); // get a new random inactive mole
    
    lastMoles.push(mole); // add the mole to the end of the array
    if (lastMoles.length > 3) // make sure there are only 3 moles in the array
      lastMoles.shift(); // remove the first element
    spawnMole(mole.id); // spawn the mole
    await sleep(MOLE_RATE[currentMode]); // wait before spawning the next mole
  }
};

// makes a mole active
const spawnMole = moleId => {
  const mole = moles[moleId];
  if (!mole) return console.warn(`unable to find mole with id ${moleId}`);
  mole.setActive(true);
  mole.loseTimeout = setTimeout(() => {
    if (!mole.active) return;
    const logicalPos = Number.parseInt(moleId.split('-')[1]) + 1; // extracts the number from the id, adds 1
    endGame(`You missed a mole! (#${logicalPos})`);
  }, MOLE_LIFESPAN[currentMode]);
};

const updateScoreText = () => {
  const highScore = fetchHighScore();

  scoreText.textContent = `HI ${highScore[currentMode]} | SCORE ${score}`; // top right score text
  document.querySelector('#final-score').textContent = score; // game over screen
  document.querySelector(`#${currentMode}High`).textContent = highScore[currentMode]; // mode selector
};

// creates a new mole element
const createMole = () => {
  const moleId = `mole-${Object.values(moles).length}`; // id of the mole (mole-0, mole-1, etc.)
  const mole = new Mole(moleId); // create a new mole class

  mole.moleElem.addEventListener('click', async () => {
    if (!gameActive) return console.warn(`${moleId} was clicked but game is not active`);
    if (!mole.active) { // end the game if the mole isn't active
      endGame('You bonked a dead mole!');
      return;
    }
    clearTimeout(mole.loseTimeout); // clear the lose setTimeout
    mole.setActive(false);
    score++;
    updateScoreText();
  });

  moles[moleId] = mole; // add the mole to the moles object

  holeHolder.append(mole.moleElem); // add the mole to the hole holder
};

// buttons in the mode selector
modeButtons.forEach(button => {
  const highScore = fetchHighScore();
  if (!highScore[button.id] || Number.isNaN(highScore[button.id])) {
    highScore[button.id] = 0;
    localStorage.setItem('highScoreMusa', JSON.stringify(highScore));
  }
  // set the high score text
  document.querySelector(`#${button.id}High`).textContent = highScore[button.id];

  // add click listener to the button
  button.addEventListener('click', () => {
    currentMode = button.id; // set the current mode
    closeMenus(); // close the mode selector
    startGame(); // start the game
  });
});

// buttons in the game over screen
playAgainButtons.forEach(button => {
  button.addEventListener('click', () => {
    closeMenus(); // close the game over screen
    if (button.id === 'playAgainYes') // if the player wants to play again, start the game
      startGame();
    else // if the player doesn't want to play again, open the mode selector
      openMenu(modeSelector);
  });
});

// debug buttons
document.querySelector('#debugStartGame').addEventListener('click', startGame);
document.querySelector('#debugStartGameNoCount').addEventListener('click', () => startGame(true));
document.querySelector('#debugMakeActive').addEventListener('click', () => {
  for (let i = 0; i < 9; i++)
    spawnMole(`mole-${i}`);
});

// shows the secret debug menu when n is pressed
window.addEventListener('keypress', event => {
  if (event.key.toLowerCase() === 'n')
    document.querySelector('#debug').classList.toggle('hidden');
}, true);

for (let i = 0; i < 9; i++) // create 9 moles
  createMole();

openMenu(modeSelector);
