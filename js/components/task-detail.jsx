var React = require('react');
var {Link} = require('react-router');
var Task = require('./task.jsx');
var NotFound = require('./not-found.jsx');


var TaskDetail = React.createClass({
  render() {
    var task = this.props.tasks.filter((t) => t.id === this.props.params.taskId)[0];
    if (!task) { return <NotFound /> }
    return (
      <div>
        <Task {...task} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = TaskDetail;
