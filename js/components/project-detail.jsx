var React = require('react');
var Reflux = require('reflux');
var stores = require('../stores');


var Overview = React.createClass({

  mixins: [Reflux.connectFilter(stores.projects, function(projects) {
    return projects.filter((p) => p.id === this.props.params.projectId)[0];
  })],

  componentWillMount() {
    this.props.params.projectId;
  },

  componentWillReceiveProps(newProps) {
    newProps.params.projectId;
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
