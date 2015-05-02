'use strict';
var husl = require('husl');
var React = require('react');
var {Link} = require('react-router');
var {duration} = require('../utils');
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


function sumTime(tasks) {
  var children = tasks.children;
  if (children.type === 'group') {
    return tasks.children.children  // ugh...
      .map(sumTime)
      .reduce((a, b) => a + b, 0);
  }
  return tasks.children
    .map((c) => c.duration)
    .reduce((a, b) => a + b, 0);
}


var TaskList = React.createClass({

  renderGroup(name, group) {
    return (
      <div className="group">
        {group.children.map((c) => (
          <div key={c.group}>
            <h3>
              {name === 'project' ?
                <Link
                  to="home"
                  query={{filter: {project: {only: [c.group]}}}}
                  className="button inverse bare"
                  style={{backgroundColor: husl.toHex(Task.getHue(c.group), 67, 58)}}>
                  {c.group}
                </Link> :
                name === 'tag' ?
                  <Link
                    to="home"
                    query={{filter: {tag: {only: [c.group]}}}}
                    className="button accent">
                    {c.group}
                  </Link> :
                    c.group}
              <small>
                {' – '}
                {duration.humanize(sumTime(c))}
              </small>
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
      return this.renderGroup(tasks.name, tasks);
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
