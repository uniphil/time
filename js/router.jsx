module.exports = {
  get() { return router; }
};

var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute} = Router;

var Root = require('./components/root.jsx');
var Overview = require('./components/overview.jsx');


var routes = (
  <Route name="home" path="/" handler={Root}>
    <DefaultRoute handler={Overview} />
  </Route>
);

var router = Router.create({
  routes: routes,
  //location: Router.HistoryLocation
});