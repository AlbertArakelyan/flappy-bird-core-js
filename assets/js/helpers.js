export const numberToUnit = (number = 0, unit = 'px') => {
  return String(number + unit);
};

export const getRotateZFromTransform = (trasnform = '') => {
  const rotateZSubtring = trasnform.substring('rotateZ(');
  const startIndex = rotateZSubtring.indexOf('(') + 1;
  const lastIndex = rotateZSubtring.indexOf(')');
  
  return parseFloat(rotateZSubtring.slice(startIndex, lastIndex));
};

export const createAndAppend = (element = 'div', $parent = document.body, className) => {
  const $elem = document.createElement(element);
  $elem.setAttribute('class', className);
  $parent.appendChild($elem);

  return $elem;
};