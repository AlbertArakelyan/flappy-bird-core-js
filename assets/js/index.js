// Helpers
import { numberToUnit, getRotateZFromTransform, createAndAppend, getPipeY } from './helpers.js';


// Global
const app = {
  __init() {
    addEventListeners();

    goingDownBird();

    createAndAppendPipe();
    this.spriteIntervals.createAndAppendPipeInterval = setInterval(() => {
      createAndAppendPipe();
    }, 3000);
  },
  sprites: {
    $bird: document.querySelector('.bird'),
    $score: document.querySelector('.score'),
  },
  spriteValues: {
    bird: {
      fallenPosition: 0,
      rotatedPosition: 0,
      isGameOver: false,
    },
    score: {
      value: 0,
      isUpdated: false,
    }
  },
  spriteIntervals: {
    createAndAppendPipeInterval: undefined,
    fallingInterval: undefined,
    movingPipesIntervals: [],
  },
};

// Game process functions

/** Bird start */
function goingDownBird() {
  const { $bird } = app.sprites;

   app.spriteIntervals.fallingInterval = setInterval(() => {
    $bird.style.top = numberToUnit(app.spriteValues.bird.fallenPosition);

    if (app.spriteValues.bird.rotatedPosition <= 90) {
      $bird.style.transform = `rotateZ(${numberToUnit(app.spriteValues.bird.rotatedPosition, 'deg')})`;
      app.spriteValues.bird.rotatedPosition += 1;
    }

    app.spriteValues.bird.fallenPosition += 10;
  }, 100);
}

function goingUpBird() {
  if (app.spriteValues.bird.isGameOver) {
    return;
  }

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

  const movingPipeInterval = setInterval(() => {
    movePipesToRight($pipeDown, $pipeUp);
    detectPipePositionTowardsBird($pipeDown, $pipeUp);
  }, 10);

  app.spriteIntervals.movingPipesIntervals.push(movingPipeInterval);
}

/**
 * 
 * @param {HTMLElement} $pipeDown 
 * @param {HTMLElement} $pipeUp 
 */
function movePipesToRight($pipeDown, $pipeUp) {
  if (parseInt($pipeDown.style.right) > window.innerWidth - 40) {
    $pipeDown.remove();
    $pipeUp.remove();
  }
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
    const { $bird, $score } = app.sprites;
    const { x: birdX, y: birdY, height: birdHeight, width: birdWidth } = $bird.getBoundingClientRect();
    const { x: pipeX, width: pipeWidth } = $pipe.getBoundingClientRect();
    const pipeY = getPipeY($pipe);


    const verticalCondition = $pipe.classList.contains('rotated') ?
      pipeY >= birdY : 
      pipeY <= birdY + birdHeight;

    if (pipeX <= birdX + birdWidth && !(pipeX + pipeWidth <= birdX + birdWidth) && verticalCondition) {
      clearInterval(app.spriteIntervals.fallingInterval);
      clearInterval(app.spriteIntervals.createAndAppendPipeInterval);
      app.spriteIntervals.movingPipesIntervals.forEach((movingPipeInterval) => {
        clearInterval(movingPipeInterval);
      });

      const deathSound = new Howl({
        src: ['./death-sound.mp3'],
        volume: 1,
        loop: false,
      });
      
      deathSound.once('load', function() {
        deathSound.play();
      });

      const top = parseInt($bird.style.top);
      app.spriteValues.bird.fallenPosition = top - 75;
      $bird.style.top = numberToUnit(top - 75);
      app.spriteValues.bird.isGameOver = true;
      setTimeout(() => {
        $bird.style.top = '100%';
      }, 300);

      setTimeout(() => {
        location.reload();
      }, 1000);
    }

    if (pipeX <= birdX + birdWidth && !(pipeX + pipeWidth <= birdX + birdWidth)) {
      // app.spriteValues.score.isUpdated = true;
      app.spriteValues.score.value++;
      $score.innerHTML = app.spriteValues.score.value;
    }

    // if (pipeX + pipeWidth <= birdX + 5 && app.spriteValues.score.isUpdated) {
    //   app.spriteValues.score.isUpdated = false;
    // }
  }
}
/** Pipe end */

/** Background music start */
const backgroundMusic = new Howl({
  src: ['./super-mario-song.mp3'],
  volume: 0.3,
  loop: true,
});

backgroundMusic.once('load', function() {
  backgroundMusic.play();
});
/** Background music end */

function addEventListeners() {
  document.body.addEventListener('click', goingUpBird);
}

// Start game
app.__init();