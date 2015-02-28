module.exports = {
  get() { return router; }
};

var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute} = Router;

var Root = require('./components/root.jsx');
var Overview = require('./components/overview.jsx');
var TaskDetail = require('./components/task-detail.jsx');
var ProjectsOverview = require('./components/projects-overview.jsx');
var ProjectDetail = require('./components/project-detail.jsx');


var routes = (
  <Route name="home" path="/" handler={Root}>
    <DefaultRoute handler={Overview} />
    <Route name="task" path="tasks/:taskId" handler={TaskDetail} />
    <Route name="projects" path="projects" handler={ProjectsOverview} />
    <Route name="project" path="projects/:project" handler={ProjectDetail} />
  </Route>
);

var router = Router.create({
  routes: routes,
  //location: Router.HistoryLocation
});
