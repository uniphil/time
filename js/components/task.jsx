var React = require('react');
var actions = require('../actions');


var Task = React.createClass({

  getInitialState() {
    return {
      editing: false
    };
  },

  edit(e) {
    e && e.preventDefault();
    this.setState({
      editing: true
    });
  },

  commit(e) {
    e && e.preventDefault();
    var timeEl = this.refs.time.getDOMNode(),
        descEl = this.refs.description.getDOMNode();

    var task = {
      id: this.props.id,
      time: timeEl.value.trim(),
      description: descEl.value.trim()
    };

    actions.updateTask(this.props.id, task);
    // TODO: handle async stuff

    this.setState({
      editing: false
    });
  },

  cancel(e) {
    e && e.preventDefault();
    this.setState({
      editing: false
    });
  },

  remove(e) {
    e && e.preventDefault();
    actions.removeTask(this.props.id);
  },

  renderDisplay() {
    return (
      <span>
        <strong>{this.props.time}</strong>
        <span> {this.props.description}</span>
        <button onClick={this.edit}>e</button>
        <button onClick={this.remove}>&times;</button>
      </span>
    );
  },

  renderEditing() {
    return (
      <form onSubmit={this.commit}>
        <input type="text" defaultValue={this.props.time} ref="time" />
        <input type="text" defaultValue={this.props.description} ref="description" />
        <button type="submit">save</button>
        <button onClick={this.cancel}>cancel</button>
      </form>
    );
  },

  render() {
    return this.state.editing ? this.renderEditing() : this.renderDisplay();
  }
});


module.exports = Task;
