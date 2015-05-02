'use strict';
var murmur = require('murmurhash-js/murmurhash3_gc');
var husl = require('husl');
var React = require('react/addons');
var {Link} = require('react-router');
var Reflux = require('reflux');
var stores = require('../stores');
var actions = require('../actions');
var Task = require('./task.jsx');
var Icon = require('./icon.jsx');


var Export = React.createClass({

  mixins: [Reflux.connect(stores.tasks, 'tasks')],

  getInitialState() {
    return {mode: 'json'};
  },

  render() {
    return (
      <div className="tool tool-export">
        <h3><Icon id="export" /> Export</h3>
        <p>All your tasks in JSON format:</p>
        <textarea
          className="export-box"
          value={JSON.stringify(this.state.tasks)}
          readOnly={true} />
      </div>
    );
  }
});


function getRecentProjects(n) {
  n = n || 5;
  var recentTasks = [];
  stores.tasks.data.every((task) => {
    (recentTasks.indexOf(task.project) === -1) && recentTasks.push(task.project);
    return recentTasks.length < n;
  });
  return recentTasks;
}


var Settings = React.createClass({

  mixins: [
    Reflux.listenTo(stores.config, 'onConfigChange'),
    Reflux.listenTo(stores.tasks, 'onTasksChange'),
    React.addons.LinkedStateMixin
  ],

  getInitialState() {
    return {
      seed: stores.config.data.seed,
      sampleProjects: getRecentProjects(),
    };
  },

  onConfigChange(newConfig) {
    this.setState({seed: newConfig.seed});
  },

  onTasksChange(newTasks) {
    this.setState({sampleProjects: getRecentProjects()})
  },

  setConfig(e) {
    e.preventDefault();
    actions.config.set({seed: parseInt(this.refs.seed.getDOMNode().value, 10) });
  },

  render() {
    var seed = this.state.seed;
    return (
      <form className="tool tool-settings" onSubmit={this.setConfig}>
        <h3><Icon id="gear" /> Settings</h3>
        <div className="setting-line">
          <label htmlFor="seed">Projects Palette: </label>
          <input
            id="seed"
            ref="seed"
            type="number"
            valueLink={this.linkState('seed')} />
          <div className="sample-projects" title="preview">
            {this.state.sampleProjects.map((p) => (
              <div
                key={p}
                className="sample-project"
                style={{backgroundColor: husl.toHex(murmur(p, seed), 67, 95)}}>
                <span
                  className="button inverse bare"
                  style={{backgroundColor: husl.toHex(murmur(p, seed), 67, 58)}}>
                  {p}
                </span>
              </div>
            ))}
          </div>
          <button type="submit" className="button woo">set</button>
        </div>
      </form>
    );
  },
});


var Header = React.createClass({

  getInitialState() {
    return {expanded: null};
  },

  toggler(id) {
    return (e) => {
      e.preventDefault();
      this.setState({expanded: this.state.expanded === id ? null : id});
    }
  },

  toolLink(id, name, iconId) {
    return (
      <a
        href="#"
        onClick={this.toggler(id)}
        alt={iconId + ' icon'}
        className={'button bare' + (this.state.expanded === id ? ' inverse' : '')}>
        <Icon id={iconId} title={name} /> {name}
      </a>
    );
  },

  render() {
    return (
      <div className="header">
        <div className="tools">
          <h1>
            <Link className="button woo bare" to="home">timekeep</Link>
          </h1>
          {this.toolLink('export', 'export', 'export')}
          <Link to="deleted" className='button bare'>
            <Icon id="trash" title="deleted tasks" alt="trash can" /> deleted
          </Link>
          {this.toolLink('settings', 'settings', 'gear')}
        </div>
        {{
          export: <Export />,
          settings: <Settings  config={this.props.config} />,
        }[this.state.expanded]}
        <Task mode="create" />
      </div>
    );
  },

});


module.exports = Header;
