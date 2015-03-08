var React = require('react');
var {Link} = require('react-router');
var Task = require('./task.jsx');
var Icon = require('./icon.jsx');


var Header = React.createClass({
  render() {
    var project = this.props.tasks[0] && this.props.tasks[0].project;
    return (
      <div className="header">
        <div className="header-tools">
          <h1>
            <Link className="button woo" to="home">track time</Link>
          </h1>
          <Icon id="gear" />
        </div>
        <Task
          asForm={true}
          project={project}
          formMode="create" />
      </div>
    );
  },
});


module.exports = Header;
