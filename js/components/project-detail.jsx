var React = require('react');
var TaskList = require('./task-list.jsx');


var Overview = React.createClass({

  componentWillMount() {

  },

  componentWillReceiveProps() {
    console.log('rp');
  },

  render() {
    return (
      <div>
        'proj'
        <TaskList />
      </div>
    );
  }
});


module.exports = Overview;
