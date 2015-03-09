var React = require('react');
var Reflux = require('reflux');
var {Link, RouteHandler} = require('react-router');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');

var Header = require('./header.jsx');
var Footer = require('./footer.jsx');


var Root = React.createClass({

  mixins: [Reflux.connect(stores.tasks, 'tasks')],

  render() {
    return (
      <div className="app">
        <Header tasks={this.state.tasks.ls} />
        <RouteHandler {...this.props} tasks={this.state.tasks} />
        <Footer />
      </div>
    );
  }
});


module.exports = Root;
