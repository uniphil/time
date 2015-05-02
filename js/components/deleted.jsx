'use strict';
var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');


var Deleted = React.createClass({

  mixins: [Reflux.connect(stores.backups, 'tasks')],

  render() {
    return (
      <TaskList tasks={this.state.tasks} deleted={true} />
    );
  }
});


module.exports = Deleted;
