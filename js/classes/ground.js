import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty
} from '../util/updateCustomProperty.js';

const SPEED = 0.05;
const groundElems = document.querySelectorAll('[data-ground]');

export const setupGround = () => {
  setCustomProperty(groundElems[0], '--left', 0);
  setCustomProperty(groundElems[1], '--left', 300);
};

export const updateGround = (delta, speedScale) => {
  groundElems.forEach(ground => {
    incrementCustomProperty(ground, '--left', delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, '--left') <= -300)
      incrementCustomProperty(ground, '--left', 600);
  });
};