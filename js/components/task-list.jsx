var React = require('react');
var Reflux = require('reflux');

var Task = require('./task.jsx');
var actions = require('../actions');
var stores = require('../stores');


var TaskList = React.createClass({

  mixins: [Reflux.connect(stores.tasks, 'tasks')],

  componentWillMount() {
    actions.loadTasks();
  },

  render() {
    return (
      <ul>
        { this.state.tasks.map((task) =>
          <li key={task.id}><Task {...task} /></li>
        )}
      </ul>
    );
  }
});


module.exports = TaskList;
