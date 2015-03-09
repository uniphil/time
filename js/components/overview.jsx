var React = require('react');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');
var aggregate = require('../aggregate');


var Overview = React.createClass({
  render() {
    return (
      <div>
        <TaskList
          tasks={this.props.tasks}
          aggregate={aggregate.date}
          editable={true} />
      </div>
    );
  }
});


module.exports = Overview;
