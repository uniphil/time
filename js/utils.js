'use strict';
var parseDuration = require('parse-duration');
var humanizeDuration = require('humanize-duration');
var {Some, None} = require('results');


function pick(what, obj) {
  return what.reduce((p, w) => {
    p[w] = obj[w];
    return p;
  }, {});
}


function omit(what, obj) {
  return pick(Object.keys(obj).filter((k) => what.indexOf(k) === -1), obj);
}


function findSpec(spec, list) {
  var match = list.filter((item) =>
    Object.keys(spec).every((k) => item[k] === spec[k]));
  return match.length ? Some(match[0]) : None();
}


var humanize = humanizeDuration.humanizer({
  language: 'shortEn',
  spacer: '',
  delimiter: ' ',
  languages: {
    shortEn: {
      year: 'y',
      month: 'mo',
      week: 'w',
      day: 'd',
      hour: 'h',
      minute: 'm',
      second: 's',
      millisecond: 'ms',
    },
  },
});


module.exports = {
  pick: pick,
  omit: omit,
  findSpec: findSpec,
  duration: {
    parse: parseDuration,
    humanize: humanize,
  },
};
