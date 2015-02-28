var React = require('react');
var Reflux = require('reflux');
var actions = require('../actions');
var stores = require('../stores');
var c = require('../constants');

var Task = require('./task.jsx');

var TaskList = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.tasks.load();
  },

  render() {
    return this.state.status({
      Ok: () => (
        <ul>
          { this.state.ls.map((task) =>
            <li key={task.id}>
              <Task
                {...task}
                asForm={task.editing}
                editable={this.props.editable} />
            </li>
          )}
        </ul>
      ),
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


module.exports = TaskList;
