export const sortData = (array, param, direction) => {
  if (direction === 'up') {
    return array.sort((prev, next) => (parseFloat(prev[param]) >= parseFloat(next[param])) ? 1 : -1)
  } else if (direction === 'down') {
    return array.sort((prev, next) => (parseFloat(prev[param]) < parseFloat(next[param])) ? 1 : -1)
  }
};

export const findMaxPrice = (data) => {
  const array = sortData(data, 'price', 'down');
  return array[0];
};

export const findMinPrice = (data) => {
  const result = sortData(data, 'price', 'up');
  return result[0];
};

export const findMaxArea = (data) => {
  const array = sortData(data, 'area', 'down');
  return array[0];
};

export const findMinArea = (data) => {
  const result = sortData(data, 'area', 'up');
  return result[0];
};

export const onMousePos = (elem, evt) => {
  const ClientRect = elem.getBoundingClientRect();
  return {
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
};