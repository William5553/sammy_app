export const getCustomProperty = (elem, prop) => Number.parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;

export const setCustomProperty = (elem, prop, value) => elem.style.setProperty(prop, value);

export const incrementCustomProperty = (elem, prop, inc) => setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);