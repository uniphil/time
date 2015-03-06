var React = require('react');
var Task = require('./task.jsx');


function aggreAlias(grouper) {
  return function(task) {
    return {
      task: task,
      groups: grouper(task),
    };
  };
}


function groupByAlias(grouped, {task: task, groups: groups}) {
  groups.forEach((groupName) => {
    var group = grouped.filter((g) => g.title === groupName)[0];
    if (!group) {
      group = {title: groupName, tasks: []};
      grouped.push(group);
    }
    group.tasks.push(task);
  });
  return grouped;
}


function group(tasks, grouper) {
  return tasks
    .map(aggreAlias(grouper))
    .reduce(groupByAlias, []);
}


var TaskList = React.createClass({

  render() {
    var grouped = this.props.aggregate ?
      group(this.props.tasks, this.props.aggregate) :
      [{tasks: this.props.tasks}];
    var deleted = this.props.deleted;
    return (
      <div>
        {grouped.map((group, i) => (
          <div key={i}>
            {group.title && <h3>
              {deleted && 'deleted '}
              {group.title}
              {' – '}
              <small>{group.tasks.reduce((total, task) => total+task.duration, 0)} mins</small>
            </h3>}
            <ul className="task-list">
              {group.tasks.map((task) => (
                <li key={task.id} className="task-list-item">
                  <Task
                    {...task}
                    key={task.id}
                    asForm={task.editing}
                    editable={this.props.editable}
                    deleted={this.props.deleted} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
});


module.exports = TaskList;
