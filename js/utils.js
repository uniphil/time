var parseDuration = require('parse-duration');
var humanizeDuration = require('humanize-duration');


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
  duration: {
    parse: parseDuration,
    humanize: humanize,
  },
};
