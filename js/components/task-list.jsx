var React = require('react');
var Task = require('./task.jsx');


var TaskList = React.createClass({

  listedTask(task, asTable) {
    return <Task
              {...task}
              key={task.id}
              asForm={task.editing}
              asTR={asTable}
              editable={this.props.editable} />;
  },

  renderTable(tasks) {
    return (
      <table>
        <tbody>
          {tasks.map((task) => this.listedTask(task, true))}
        </tbody>
      </table>
    );
  },

  renderList(tasks) {
    return (
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {this.listedTask(task, false)}
          </li>
        ))}
      </ul>
    );
  },

  render() {
    if (this.props.asTable) {
      return this.renderTable(this.props.tasks);
    } else {
      return this.renderList(this.props.tasks);
    }
  }
});


module.exports = TaskList;
