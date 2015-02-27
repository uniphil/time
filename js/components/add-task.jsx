var React = require('react');
var actions = require('../actions');
var styles = require('../styles');
var assign = require('object-assign');


var AddTask = React.createClass({

  getInitialState() {
    return {
      state: 'ready'
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    var timeEl = this.refs.time.getDOMNode(),
        descEl = this.refs.description.getDOMNode();

    var task = {
      time: timeEl.value.trim(),
      description: descEl.value.trim()
    };

    actions.logTask.triggerPromise(task)
      .then(() => {
        timeEl.value = '';
        descEl.value = '';
        this.setState({state: 'ready'});
      })
      .catch(() => {
        this.setState({state: 'err'});
      });

    this.setState({state: 'pending'});
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div style={assign(
          styles.state[this.state.state],
          styles.shapes.circle,
          styles.shapes.size.inline)}></div>
        <input type="text" ref="time" />
        <input type="text" ref="description" />
        <button type="submit">log</button>
      </form>
    );
  }
});


module.exports = AddTask;
