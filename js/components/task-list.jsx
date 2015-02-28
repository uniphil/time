var React = require('react');
var Task = require('./task.jsx');


var TaskList = React.createClass({
  render() {
    return (
      <ul>
        { this.props.tasks.map((task) =>
          <li key={task.id}>
            <Task
              {...task}
              asForm={task.editing}
              editable={this.props.editable} />
          </li>
        )}
      </ul>
    );
  }
});


module.exports = TaskList;
