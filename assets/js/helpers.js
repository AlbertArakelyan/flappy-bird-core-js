/**
 * 
 * @param {number} number 
 * @param {string} unit 
 * @returns {string}
 */
export const numberToUnit = (number = 0, unit = 'px') => {
  return String(number + unit);
};

/**
 * 
 * @param {string} trasnform 
 * @returns {number}
 */
export const getRotateZFromTransform = (trasnform = '') => {
  const rotateZSubtring = trasnform.substring('rotateZ(');
  const startIndex = rotateZSubtring.indexOf('(') + 1;
  const lastIndex = rotateZSubtring.indexOf(')');
  
  return parseFloat(rotateZSubtring.slice(startIndex, lastIndex));
};

/**
 * 
 * @param {string} element 
 * @param {HTMLElement} $parent 
 * @param {string} className 
 * @returns {HTMLElement}
 */
export const createAndAppend = (element = 'div', $parent = document.body, className) => {
  const $elem = document.createElement(element);
  $elem.setAttribute('class', className);
  $parent.appendChild($elem);

  return $elem;
};

/**
 * 
 * @param {HTMLElement} $pipe 
 * @returns {number}
 */
export const getPipeY = ($pipe) => {
  if ($pipe.classList.contains('rotated')) {
    return $pipe.getBoundingClientRect().y + $pipe.getBoundingClientRect().height;
  }

  return $pipe.getBoundingClientRect().y;
};