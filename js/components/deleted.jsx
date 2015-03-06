var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');
var aggregate = require('../aggregate');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');


var Deleted = React.createClass({

  mixins: [Reflux.connect(stores.backups)],

  componentWillMount() {
    actions.taskBackups.load();
  },

  render() {
    return (
      <div>
        {this.state.status({
          Ok: () => <TaskList tasks={this.state.ls} aggregate={aggregate.date} deleted={true} />,
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
        <p>
          <Link className="button" to="home">home</Link>
        </p>
      </div>
    );
  }
});


module.exports = Deleted;
