var React = require('react');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');


var tagsAlias = (task) => task.tags;


var TagsOverview = React.createClass({
  render() {
    return (
      <div>
        <h3>Tags</h3>
        <TaskList tasks={this.props.tasks} aggregate={tagsAlias} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = TagsOverview;
