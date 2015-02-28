var React = require('react');
var Reflux = require('reflux');
var {Link} = require('react-router');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');

var Project = require('./project.jsx');


var ProjectDetail = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.tasks.load();
  },

  render() {
    return this.state.status({
      Ok: () => {
        var project = this.props.params.project;
        var tasks = stores.tasks.getData().filter((t) => t.project === project);
        if (tasks.length === 0) {
          return <p>could not find that project :( <Link to="home">home</Link></p>;
        } else {
          return (
            <div>
              <Project name={project} tasks={tasks} list={true} />
              <p><Link to="home">home</Link></p>
            </div>
          );
        }
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
