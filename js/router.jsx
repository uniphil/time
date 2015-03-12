module.exports = {
  get() { return router; }
};

var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute} = Router;

var Root = require('./components/root.jsx');
var Overview = require('./components/overview.jsx');
var TaskDetail = require('./components/task-detail.jsx');
var Deleted = require('./components/deleted.jsx');
var NotFound = require('./components/not-found.jsx');


var routes = (
  <Route name="home" path="/" handler={Root}>
    <DefaultRoute handler={Overview} />
    <Route name="task" path="tasks/:taskId" handler={TaskDetail} />
    <Route name="deleted" path="deleted/" handler={Deleted} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

var router = Router.create({routes: routes});
