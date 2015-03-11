var React = require('react');
var {addons: {update}} = require('react/addons');
var {Link} = require('react-router');
var TaskList = require('./task-list.jsx');
var actions = require('../actions');
var aggregate = require('../aggregate');


var Grouper = React.createClass({

  toggle(e) {
    e && e.preventDefault();
    this.props.toggle(this.props.id);
  },

  render() {
    return (
      <a
        key={this.props.id}
        className={'grouper button' + (this.props.active ? ' inverse' : '')}
        onClick={this.toggle}>
        {this.props.name}
      </a>
    );
  },
});


function asArrByWeight(things) {
  return Object.keys(things)
    .map((id) => update(things[id], {$merge: {id}}))
    .sort((a, b) => a.weight - b.weight);
}


var Query = React.createClass({

  getInitialState() {
    return {
      group: {
        date: {
          weight: 0,
          name: 'date',
          active: true,
        },
        project: {
          weight: 1,
          name: 'project',
          active: false,
        },
        tag: {
          weight: 2,
          name: 'tag',
          active: false,
        }
      },
    };
  },

  toggleGrouper(id) {
    var u = {}; u[id] = {active: {$apply: (a) => !a}};
    var newState = update(this.state, {group: u});
    actions.query.set({
      group: asArrByWeight(newState.group)
        .filter((g) => g.active)
        .map((g) => g.id)
    });
    this.setState(newState);
  },

  render() {
    return (
      <div className="query">
        <strong>group</strong>
        {asArrByWeight(this.state.group).map((g) => (
          <Grouper
            {...g}
            key={g.id}
            toggle={this.toggleGrouper} />))}
      </div>
    );
  },
});


var Overview = React.createClass({
  render() {
    return (
      <div>
        <Query />
        <TaskList
          tasks={this.props.tasks}
          aggregate={aggregate.date}
          editable={true} />
      </div>
    );
  }
});


module.exports = Overview;
