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

  renderGroup(group) {
    return (
      <div>
        {group.children.map((c) => (
          <div key={c.group}>
            <h3>
              {group.name}: {c.group}
              {' – '}
              <small>... some amount of time...</small>
            </h3>
            <TaskList {...this.props} tasks={c.children} />
          </div>
        ))}
      </div>
    );
  },

  render() {
    var tasks = this.props.tasks;
    if (tasks.type === 'group') {
      return this.renderGroup(tasks);
    }
    return (
      <ol className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-list-item">
            <Task
              {...task}
              key={task.id} />
          </li>
        ))}
      </ol>
    );
  }
});


module.exports = TaskList;
