var React = require('react');
var {Link} = require('react-router');

var Tag = require('./tag.jsx');


var TaskList = React.createClass({
  render() {
    var tags = this.props.tasks.reduce((tags, task) => {
      task.tags.forEach((tag) => {
        var taskList = tags[tag];
        taskList && taskList.push(task) || (tags[tag] = [task]);
      })
      return tags;
    }, {});
    return (
      <ul>
        { Object.keys(tags).map((tagName) =>
          <li key={tagName}>
            <h4><Link to="tag" params={{tag:tagName}}>{tagName}</Link></h4>
            <Tag name={tagName} tasks={tags[tagName]} list={false} />
          </li>
        )}
      </ul>
    );
  }
});


module.exports = TaskList;
