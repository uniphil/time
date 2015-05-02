'use strict';
var React = require('react');
var router = require('./router.jsx').get();

var appContainer = document.getElementById('app');

router.run(function(Handler, state) {
  React.render(React.createElement(Handler, state), appContainer);
});
