var React = require('react');
var {Link} = require('react-router');
var Project = require('./project.jsx');
var NotFound = require('./not-found.jsx');


var ProjectDetail = React.createClass({
  render() {
    var project = this.props.params.project;
    var tasks = this.props.tasks.filter((t) => t.project === project);
    if (tasks.length === 0) { return <NotFound />; }
    return (
      <div>
        <h3>Project: {project}</h3>
        <Project name={project} tasks={tasks} list={true} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = ProjectDetail;
