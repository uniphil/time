var React = require('react');
var {Link} = require('react-router');
var actions = require('../actions');

var Task = React.createClass({

  edit(e) {
    e && e.preventDefault();
    actions.tasks.beginEdit(this.props.id);
  },

  commit(e) {
    e && e.preventDefault();
    var durEl = this.refs.dur.getDOMNode(),
        projEl = this.refs.project.getDOMNode();
        sumEl = this.refs.summary.getDOMNode();
        tagsEl = this.refs.tags.getDOMNode();

    var task = {
      duration: parseInt(durEl.value.trim(), 10),
      project: projEl.value.trim(),
      summary: sumEl.value.trim(),
      tags: tagsEl.value.trim().split(', '),
    };

    if (this.props.formMode !== 'create') {
      task.id = this.props.id;
      task.timestamp = this.props.timestamp;
      actions.tasks.update(this.props.id, task);
    } else {
      task.timestamp = (new Date()).getTime();  // timestamp
      actions.tasks.create(task);
    }
  },

  cancel(e) {
    e && e.preventDefault();
    actions.tasks.cancelEdit(this.props.id);
  },

  remove(e) {
    e && e.preventDefault();
    actions.tasks.remove(this.props.id);
  },

  renderDisplay() {
    var editable = this.props.editable;
    return (
      <span style={{background: this.props.pending ? '#ff9' : 'transparent'}}>
        <strong>{this.props.duration}</strong> mins
        <span> <Link to="project" params={{project: this.props.project}}>{this.props.project}</Link></span>
        <span> <Link to="task" params={{taskId: this.props.id}}>{this.props.summary}</Link></span>
        <span> {this.props.tags}</span>
        {editable && <button onClick={this.edit}>e</button>}
        {editable && <button onClick={this.remove} alt="delete">&times;</button>}
      </span>
    );
  },

  renderForm() {
    var editMode = this.props.formMode !== 'create';
    return (
      <form onSubmit={this.commit}>
        <label>
          Time spent
          <input type="number" defaultValue={this.props.dur || 0} ref="dur" />
        </label>
        <label>
          Project
          <input type="text" defaultValue={this.props.project || 'personal'} ref="project" />
        </label>
        <label>
          Task Summary
          <input type="text" defaultValue={this.props.summary} ref="summary" />
        </label>
        <label>
          Tags
          <input type="text" defaultValue={this.props.tags} ref="tags" />
        </label>
        <button type="submit">save</button>
        {editMode && <button onClick={this.cancel}>cancel</button>}
        {editMode && <button onClick={this.remove} alt="delete">&times;</button>}
      </form>
    );
  },

  render() {
    return this.props.asForm ? this.renderForm() : this.renderDisplay();
  }
});


module.exports = Task;
