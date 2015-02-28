var {Some, None} = require('results');
var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var actions = require('../actions');
var stores = require('../stores');
var c = require('../constants');
var Task = require('./task.jsx');


var TaskDetail = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.task.loadAll();
  },

  getTask() {
    var id = this.props.params.taskId;
    var task = this.state.ls.filter((task) => task.id === id)[0];
    return task? Some(task) : None();
  },

  render() {
    return this.state.status({
      Ok: () => {
        return this.getTask()({
          Some: (task) => <Task {...task} />,
          None: () => <p>could not find that task :( <Link to="home">home</Link></p>,
        });
      },
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
    });
  }
});


module.exports = TaskDetail;
