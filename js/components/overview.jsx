var React = require('react');
var {addons: {update, PureRenderMixin}} = require('react/addons');
var TaskList = require('./task-list.jsx');
var Icon = require('./icon.jsx');
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
        className={'grouper button' + (this.props.active ? ' inverse woo' : '')}
        title={this.props.active ? 'enabled' : 'disabled'}
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

  mixins: [PureRenderMixin],

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

  componentWillUpdate(nextProps, nextState) {
    actions.query.set({
      group: asArrByWeight(nextState.group)
        .filter((g) => g.active)
        .map((g) => g.id)
    });
  },

  toggleGrouper(id) {
    var u = {}; u[id] = {active: {$apply: (a) => !a}};
    this.setState(update(this.state, {group: u}));
  },

  swapGroupAround(i) {
    var ab = asArrByWeight(this.state.group).splice(i, 2);
    var u = {};
    u[ab[0].id] = {weight: {$set: ab[1].weight}};
    u[ab[1].id] = {weight: {$set: ab[0].weight}};
    this.setState(update(this.state, {group: u}));
  },

  render() {
    var groupsByWeight = asArrByWeight(this.state.group);
    return (
      <div className="query">
        <strong>group tasks by: </strong>
        <span className="group buttons">
          {groupsByWeight.map((g, i) => (
            <span key={g.id}>
              <Grouper
                {...g}
                toggle={this.toggleGrouper} />
              {i < (groupsByWeight.length - 1) && (
                <button
                  className="swap button bare accent nofocus"
                  title="swap order"
                  onClick={() => this.swapGroupAround(i)}>
                  <Icon id="swap" alt="reorder grouping" />
                </button>)}
            </span>
          ))}
        </span>
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
          tasks={this.props.query(this.props.tasks)}
          editable={true} />
      </div>
    );
  }
});


module.exports = Overview;
