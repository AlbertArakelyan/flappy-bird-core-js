// Helpers
import { numberToUnit, getRotateZFromTransform } from './helpers.js';


// Global
const app = {
  __init() {
    addEventListeners();

    goingDownBird();
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
function goingDownBird() {
  const { $bird } = app.sprites;

  const fallingInterval = setInterval(() => {
    $bird.style.top = numberToUnit(app.spriteValues.bird.fallenPosition);

    if (app.spriteValues.bird.rotatedPosition <= 90) {
      $bird.style.transform = `rotateZ(${numberToUnit(app.spriteValues.bird.rotatedPosition, 'deg')})`;
      app.spriteValues.bird.rotatedPosition += 1;
    }

    app.spriteValues.bird.fallenPosition += 2;
  }, 100);
}

function goingUpBird() {
  const { $bird } = app.sprites;

  const top = parseInt($bird.style.top);
  const rotateZ = getRotateZFromTransform($bird.style.transform);

  app.spriteValues.bird.fallenPosition = top - 25;
  $bird.style.top = numberToUnit(top - 25);

  if (rotateZ >= -30) {
    app.spriteValues.bird.rotatedPosition = rotateZ - 15;
    $bird.style.transform = `rotateZ(${numberToUnit(rotateZ - 15, 'deg')})`;
  }
}

function addEventListeners() {
  document.body.addEventListener('click', goingUpBird);
}

// Start game
app.__init();