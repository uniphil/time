var React = require('react');
var {Link} = require('react-router');

var TaskList = require('./task-list.jsx');


var Project = React.createClass({
  render() {
    var list = this.props.list,
        totalTime = this.props.tasks.reduce((a, b) => a + b.duration, 0);
    return (
      <div>
        {list && <TaskList tasks={this.props.tasks} />}
        <p>total time: {totalTime} minutes</p>
      </div>
    )
  },
});


module.exports = Project;
