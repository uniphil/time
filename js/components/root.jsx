var React = require('react');
var Reflux = require('reflux');
var {Link, RouteHandler} = require('react-router');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');

var Task = require('./task.jsx');


var Root = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.tasks.load();
  },

  render() {
    return (
      <div>
        <Task asForm={true} formMode="create" />
        {this.state.status({
          Ok: () => <RouteHandler {...this.props} tasks={this.state.ls} />,
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
          },
        })}
      </div>
    );
  }
});


module.exports = Root;
