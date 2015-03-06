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
        <p>
          <Link className="button" to="projects">projects</Link>{' '}
          <Link className="button" to="tags">tags</Link>
        </p>
      </div>
    );
  }
});


module.exports = Overview;
