var assign = require('object-assign');
var React = require('react');
var {Link} = require('react-router');
var actions = require('../actions');


var TagSet = React.createClass({
  render() {
    var tags = this.props.tags;

    return (
      <span>
        {tags.map((tag, i) => (
          <span key={tag}>
            <Link className="button accent" to="tag" params={{tag: tag}}>
              {tag}
            </Link>
            {i < tags.length-1 ? <span className="hide-sep">, </span> : ''}
          </span>
        ))}
      </span>
    );
  },
});


var LabeledInput = React.createClass({
  render() {
    return (
      <div className={'task-form-input-container ' + (this.props.containerClass || '')}>
        <label htmlFor={this._rootNodeID + '-input'}>{this.props.label}</label>
        <input id={this._rootNodeID + '-input'} {...this.props} />
      </div>
    );
  }
});


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
      tags: ((t) => t && t.split(',').map((t) => t.trim()) || [])(tagsEl.value.trim()),
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
    var editing = this.props.editable;
    return (
      <div className="task" onDoubleClick={this.edit}>
        <div className="task-duration">
          <span className="task-duration-value">{this.props.duration}</span> mins
        </div>
        <div className="task-project">
          <Link className="button accent inverse" to="project" params={{project: this.props.project}}>
            {this.props.project}
          </Link>
        </div>
        <div className="task-summary">
          {this.props.summary}
        </div>
        <TagSet tags={this.props.tags} />
        {editing && (
          <div className="task-edit-buttons">
            <button className="button bare" onClick={this.edit} title="edit">
              /
            </button>
            <button className="button bare caution" onClick={this.remove} title="delete">
              &times;
            </button>
          </div>
        )}
      </div>
    );
  },

  renderForm() {
    var editMode = this.props.formMode !== 'create',
        id = (name) => this._rootNodeID + name;
    return (
      <form
        className={'task task-form task-form-' + (editMode? 'edit' : 'create')}
        onSubmit={this.commit}>
        <LabeledInput
          containerClass="task-duration task-form-duration"
          label="Time"
          type="number"
          defaultValue={this.props.duration || 10}
          ref="dur" />
        <LabeledInput
          containerClass="task-project task-form-project"
          label="Project"
          type="text"
          defaultValue={this.props.project || 'personal'}
          ref="project" />
        <LabeledInput
          containerClass="task-summary task-form-summary"
          label="Summary"
          type="text"
          defaultValue={this.props.summary}
          ref="summary" />
        <LabeledInput
          containerClass="task-tags task-form-tags"
          label="Tags"
          type="text"
          defaultValue={this.props.tags}
          ref="tags" />
        <div className="task-edit-buttons task-form-edit-buttons">
          <button
            type="submit"
            className="button inverse woo"
            title="save">save</button>
          {editMode && <button
            onClick={this.cancel}
            className="button"
            title="cancel">&times;</button>}
        </div>
      </form>
    );
  },

  render() {
    return this.props.asForm ? this.renderForm() : this.renderDisplay();
  }
});


module.exports = Task;
