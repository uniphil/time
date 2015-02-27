var React = require('react');
var {RouteHandler} = require('react-router');
var AddTask = require('./add-task.jsx');


var Root = React.createClass({
  render() {
    return (
      <div>
        <AddTask />
        <RouteHandler {...this.props} />
      </div>
    );
  }
});


module.exports = Root;
