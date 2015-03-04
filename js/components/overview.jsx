var React = require('react');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');


function dateAlias(task) {
  var now = new Date(),
      today = now.toLocaleDateString(),
      yesterday = (new Date(now.getTime() - 24*60*60*1000)).toLocaleDateString(),
      taskDate = (new Date(task.timestamp)).toLocaleDateString();

  return [taskDate === today ? 'today'
          : taskDate === yesterday ? 'yesterday'
            : taskDate];
}


var Overview = React.createClass({
  render() {
    return (
      <div>
        <TaskList
          tasks={this.props.tasks}
          aggregate={dateAlias}
          editable={true} />
        <p>
          <Link className="button" to="projects">projects</Link>{' '}
          <Link className="button" to="tags">tags</Link>
        </p>
      </div>
    );
  }
});


module.exports = Overview;
