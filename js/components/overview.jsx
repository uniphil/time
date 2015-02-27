var React = require('react');
var TaskList = require('./task-list.jsx');


var Overview = React.createClass({
  render() {
    return (
      <TaskList />
    );
  }
});


module.exports = Overview;
