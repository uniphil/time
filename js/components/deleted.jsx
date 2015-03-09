var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');
var aggregate = require('../aggregate');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');


var Deleted = React.createClass({

  mixins: [Reflux.connect(stores.backups, 'tasks')],

  render() {
    return (
      <div>
        <TaskList tasks={this.state.tasks} aggregate={aggregate.date} deleted={true} />
        <p>
          <Link className="button" to="home">home</Link>
        </p>
      </div>
    );
  }
});


module.exports = Deleted;
