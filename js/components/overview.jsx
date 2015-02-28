var React = require('react');
var Reflux = require('reflux');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');

var TaskList = require('./task-list.jsx');


var Overview = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.tasks.load();
  },

  render() {
    return this.state.status({
      Ok: () => <TaskList tasks={this.state.ls} editable={true} />,
      Err: (why) => {
        if (why === c.NOT_LOADED) {
          return <p>'not loaded'</p>;
        } else if (why === c.LOADING) {
          return <p>'loading...'</p>;
        } else if (why === c.LOAD_FAILED) {
          return <p>'load failed :('</p>;
        } else {
          return <p>'tasks didn\'t load...'</p>;
        }
      }
    });
  }
});


module.exports = Overview;
