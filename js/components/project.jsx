var React = require('react');
var TaskList = require('./task-list.jsx');


var Project = React.createClass({
  render() {
    var totalTime = this.props.tasks.reduce((a, b) => a + b.duration, 0);
    return (
      <div>
        <h3>{this.props.name}</h3>
        <TaskList tasks={this.props.tasks} />
        <p>total time: {totalTime} minutes</p>
      </div>
    )
  },
});


module.exports = Project;
