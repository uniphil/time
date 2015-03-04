var React = require('react');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');


var projectAlias = (task) => [task.project];


var ProjectOverview = React.createClass({
  render() {
    return (
      <div>
        <h3>Projects</h3>
        <TaskList tasks={this.props.tasks} aggregate={projectAlias} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = ProjectOverview;
