var assign = require('object-assign');
var husl = require('husl');


function addHue(hue, change) {
  if (hue < 0 || hue > 360) {
    console.warn('Hue should be in range 0..360, got', hue);
    while (hue < 0) hue += 360;
  }
  while (change < 0) change += 360;
  return (hue + change) % 360;
}


function changeNorm(from, by) {
  if (by < -1 || by > 1) {
    console.warn('change by should be in range -1..1, got', by);
    by = (by < 0)? -1 : 1;
  }
  return from + ((by < 0) ? -(1 - by * from) : (by * (1 - from)));
}


var changeSaturation = changeNorm;
var changeLightness = changeNorm;

var colours = {
  bg: () => ({
    h: 0,
    s: 0,
    l: 1,
    inverse: () => ({l: 0.1}),
  }),
  text: () => ({
    h: 0,
    s: 0,
    l: 0.05,
    inverse: () => ({l: 1}),
    mute: () => ({l: 0.5}),
  }),
  accent: () => ({  // purple
    h: 280,
    s: 0.6,
    l: 0.6,
  }),
  caution: () => ({
    h: 350,
    s: 0.6,
    l: 0.5,
  }),
};


function colour(name /*, args */) {
  if (!colours[name]) {
    throw new Error('could not find colour ' + name);
  }
  var c = colours[name]();
  Array.prototype.slice.call(arguments, 1).forEach((arg) => {
    if (!colours[name]()[arg]) {
      throw new Error('could not find argument ' + arg + ' for colour ' + name);
    }
    assign(c, colours[name]()[arg]());
  });
  return husl.toHex(c.h, c.s * 100, c.l * 100);
}


var buttons = {
  base: () => ({
    display: 'inline-block',
    padding: '0 5px',
    backgroundColor: 'transparent',
    fontSize: '0.8em',
    cursor: 'pointer',
    color: colour('text', 'mute'),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colour('text', 'mute'),
    borderRadius: '5px',
    textDecoration: 'none',
  }),
  bare: () => ({
    borderColor: 'transparent',
  }),
  inverse: (b) => ({
    borderColor: b.color || colour('bg', 'inverse'),
    backgroundColor: b.color || colour('bg', 'inverse'),
    color: (b.backgroundColor === 'transparent')? colour('text', 'inverse') : b.backgroundColor,
  }),
  tag: () => ({
    color: colour('accent'),
    borderColor: colour('accent'),
  }),
  caution: () => ({
    color: colour('caution'),
    borderColor: colour('caution'),
  }),
};


function button(/* args */) {
  var args = ['base'].concat(Array.prototype.slice.apply(arguments));
  var b = {};
  args.forEach((arg) => {
    if (!arg) { return; }
    if (!buttons[arg]) {
      throw new Error('could not find argument ' + arg + ' for button');
    }
    assign(b, buttons[arg](b));
  });
  return b;
}


var space = {
  display: 'inline-block',
  color: 'transparent',
  width: '0.3em',
};


module.exports = {
  colour: colour,
  button: button,
  space: space,
};
