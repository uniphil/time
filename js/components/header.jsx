var React = require('react');
var Task = require('./task.jsx');


var Header = React.createClass({
  render() {
    var project = this.props.tasks[0] && this.props.tasks[0].project;
    return (
      <div className="header">
        <Task
          asForm={true}
          project={project}
          formMode="create" />
      </div>
    );
  },
});


module.exports = Header;
