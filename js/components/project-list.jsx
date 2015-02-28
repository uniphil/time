var React = require('react');
var {Link} = require('react-router');

var Project = require('./project.jsx');


var TaskList = React.createClass({

  render() {
    var projects = this.props.tasks.reduce((projects, task) => {
      var taskList = projects[task.project];
      taskList && taskList.push(task) || (projects[task.project] = [task]);
      return projects;
    }, {});
    return (
      <ul>
        { Object.keys(projects).map((projectName) =>
          <li key={projectName}>
            <h4><Link to="project" params={{project:projectName}}>{projectName}</Link></h4>
            <Project name={projectName} tasks={projects[projectName]} list={false} />
          </li>
        )}
      </ul>
    );
  }
});


module.exports = TaskList;
