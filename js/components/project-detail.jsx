var {Some, None} = require('results');
var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var stores = require('../stores');
var c = require('../constants');

var Project = require('./project.jsx');


var ProjectDetail = React.createClass({

  mixins: [Reflux.connect(stores.projects)],

  render() {
    return this.state.status({
      Ok: () => {
        return stores.projects.get(this.props.params.projectId)({
          Some: (project) => (
            <div>
              <Project {...project} />
              <Link to="home">home</Link>
            </div>
          ),
          None: () => <p>could not find that project :( <Link to="home">home</Link></p>,
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
          return <p>'projects didn\'t load...'</p>;
        }
      },
    });
  }
});


module.exports = ProjectDetail;
