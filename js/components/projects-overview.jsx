var React = require('react');
var {Link} = require('react-router');
var ProjectList = require('./project-list.jsx');


var ProjectOverview = React.createClass({
  render() {
    return (
      <div>
        <h3>Projects</h3>
        <ProjectList tasks={this.props.tasks} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = ProjectOverview;
