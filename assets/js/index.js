// Helpers
import { numberToUnit, getRotateZFromTransform, createAndAppend, getPipeY } from './helpers.js';


// Global
const app = {
  __init() {
    addEventListeners();

    goingDownBird();

    createAndAppendPipe();
    // setInterval(() => {
    //   createAndAppendPipe();
    // }, 3000);
  },
  sprites: {
    $bird: document.querySelector('.bird'),
  },
  spriteValues: {
    bird: {
      fallenPosition: 0,
      rotatedPosition: 0,
    },
  },
};

// Game process functions

/** Bird start */
function goingDownBird() {
  const { $bird } = app.sprites;

  const fallingInterval = setInterval(() => {
    $bird.style.top = numberToUnit(app.spriteValues.bird.fallenPosition);

    if (app.spriteValues.bird.rotatedPosition <= 90) {
      $bird.style.transform = `rotateZ(${numberToUnit(app.spriteValues.bird.rotatedPosition, 'deg')})`;
      app.spriteValues.bird.rotatedPosition += 1;
    }

    app.spriteValues.bird.fallenPosition += 10;
  }, 100);
}

function goingUpBird() {
  const { $bird } = app.sprites;

  const top = parseInt($bird.style.top);
  const rotateZ = getRotateZFromTransform($bird.style.transform);

  app.spriteValues.bird.fallenPosition = top - 35;
  $bird.style.top = numberToUnit(top - 35);

  if (rotateZ >= -30) {
    app.spriteValues.bird.rotatedPosition = rotateZ - 35;
    $bird.style.transform = `rotateZ(${numberToUnit(rotateZ - 35, 'deg')})`;
  }
}
/** Bird end */

/** Pipe start */
function createAndAppendPipe() {
  const $pipeDown = createAndAppend('div', document.body, 'pipe');
  $pipeDown.innerHTML = '<img src="./assets/images/pipe.png" alt="pipe">';

  const $pipeUp = createAndAppend('div', document.body, 'pipe rotated');
  $pipeUp.innerHTML = '<img src="./assets/images/pipe.png" alt="pipe">';

  const pipeUpPoistion = Math.floor((Math.random() * 300) - 300);
  $pipeUp.style.top = `${pipeUpPoistion}px`;

  $pipeDown.style.top = `calc(100% - ${Math.abs(pipeUpPoistion - 175)}px)`;

  $pipeDown.style.right = '-120px';
  $pipeUp.style.right = '-120';

  setInterval(() => {
    movePipesToRight($pipeDown, $pipeUp);
    detectPipePositionTowardsBird($pipeDown, $pipeUp);
  }, 10);
}

/**
 * 
 * @param {HTMLElement} $pipeDown 
 * @param {HTMLElement} $pipeUp 
 */
function movePipesToRight($pipeDown, $pipeUp) {
  const rightPosition = parseInt($pipeDown.style.right) + 1;
  $pipeDown.style.right = `${rightPosition}px`;
  $pipeUp.style.right = `${rightPosition}px`;
}

/**
 * 
 * @param {HTMLElement} $pipeDown 
 * @param {HTMLElement} $pipeUp 
 */
function detectPipePositionTowardsBird($pipeDown, $pipeUp) {
  for (const $pipe of [$pipeDown, $pipeUp]) {
    const { $bird } = app.sprites;
    const { x: birdX, y: birdY, height: birdHeight, width: birdWidth } = $bird.getBoundingClientRect();
    const { x: pipeX, width: pipeWidth } = $pipe.getBoundingClientRect();
    const pipeY = getPipeY($pipe);


    const verticalCondition = $pipe.classList.contains('rotated') ?
      pipeY >= birdY : 
      pipeY <= birdY + birdHeight;

    if (pipeX <= birdX + birdWidth && !(pipeX + pipeWidth <= birdX + birdWidth) && verticalCondition) {
      alert('Game over');
    }
  }
}
/** Pipe end */

function addEventListeners() {
  document.body.addEventListener('click', goingUpBird);
}

// Start game
app.__init();