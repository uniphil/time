var React = require('react');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');


var Overview = React.createClass({
  render() {
    return (
      <div>
        <TaskList tasks={this.props.tasks} editable={true} />
        <p>
          <Link to="projects">projects</Link>{' '}
          <Link to="tags">tags</Link>
        </p>
      </div>
    );
  }
});


module.exports = Overview;
