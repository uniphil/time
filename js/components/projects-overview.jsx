var React = require('react');
var actions = require('../actions');


var Overview = React.createClass({

  componentWillMount() {
    actions.projects.load();
  },

  render() {
    return (
      <div>
        <h3>hello</h3>
      </div>
    );
  }
});


module.exports = Overview;
