var React = require('react');
var {Link} = require('react-router');
var stores = require('../stores');
var actions = require('../actions');
var Task = require('./task.jsx');
var Icon = require('./icon.jsx');


var Export = React.createClass({
  render() {
    return <div>helloooooo exports</div>;
  }
});


var Settings = React.createClass({

  changeSeed(e) {
    e && e.preventDefault();
    actions.config.set({seed: parseInt(this.refs.seed.getDOMNode().value, 10) });
  },

  setConfig(e) {
    e.preventDefault();
    this.changeSeed();
  },

  render() {
    return (
      <form onSubmit={this.setConfig}>
        <label htmlFor="seed">seed</label>
        <input
          id="seed"
          ref="seed"
          type="number"
          defaultValue={this.props.config.seed}
          onInput={this.changeSeed} />
        <button type="submit" className="button">ok</button>
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
        className={'button bare' + (this.state.expanded === id ? ' inverse' : '')}>
        <Icon id={iconId} title={name} />
      </a>
    );
  },

  render() {
    return (
      <div className="header">
        <div className="tools">
          <h1>
            <Link className="button woo" to="home">track time</Link>
          </h1>
          {this.toolLink('export', 'export', 'download')}
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
