var React = require('react');
var {RouteHandler} = require('react-router');
var Task = require('./task.jsx');


var Root = React.createClass({
  render() {
    return (
      <div>
        <Task asForm={true} formMode="create" />
        <RouteHandler {...this.props} />
      </div>
    );
  }
});


module.exports = Root;
