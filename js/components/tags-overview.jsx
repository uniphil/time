var React = require('react');
var {Link} = require('react-router');
var TagsList = require('./tag-list.jsx');


var ProjectOverview = React.createClass({
  render() {
    return (
      <div>
        <h3>Tags</h3>
        <TagsList tasks={this.props.tasks} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = ProjectOverview;
