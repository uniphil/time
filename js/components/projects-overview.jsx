var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');

var ProjectList = require('./project-list.jsx');


var ProjectOverview = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.tasks.load();
  },

  render() {
    return this.state.status({
      Ok: () => (
        <div>
          <h3>Projects</h3>
          <ProjectList tasks={this.state.ls} />
          <p><Link to="home">home</Link></p>
        </div>
      ),
      Err: (why) => {
        if (why === c.NOT_LOADED) {
          return <p>'not loaded'</p>;
        } else if (why === c.LOADING) {
          return <p>'loading...'</p>;
        } else if (why === c.LOAD_FAILED) {
          return <p>'load failed :('</p>;
        } else {
          return <p>'projects didn\'t load...'</p>;
        }
      },
    });
  }
});


module.exports = ProjectOverview;
