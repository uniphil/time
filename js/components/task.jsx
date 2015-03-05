var assign = require('object-assign');
var murmur = require('murmurhash-js/murmurhash3_gc');
var husl = require('husl');
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


var Task = React.createClass({

  getInitialState() {
    return {hue: 180}
  },

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

  typeProject(e) {
    var projInput = this.refs.project.getDOMNode();
    this.setState({hue: murmur(projInput.value) % 360});
  },

  renderDisplay() {
    var editing = this.props.editable;
    return (
      <div
        className="task"
        style={{
          color: husl.toHex(this.props.hue, 67, 7),
          backgroundColor: husl.toHex(this.props.hue, 67, 95)}}
        onDoubleClick={this.edit}>
        <div className="task-duration">
          <span className="task-duration-value">{this.props.duration}</span> mins
        </div>
        <div className="task-project">
          <Link
            className="button accent inverse bare"
            style={{backgroundColor: husl.toHex(this.props.hue, 67, 58)}}
            to="project"
            params={{project: this.props.project}}>
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

  labeledInput(key, label, props) {
    return (
      <div className={'task-form-input-container task-' + key + ' task-form-' + key}>
        <label htmlFor={this._rootNodeID + '-' + key}>{label}</label>
        <input id={this._rootNodeID + '-' + key} {...props} />
      </div>
    );
  },

  renderForm() {
    var editMode = this.props.formMode !== 'create',
        id = (name) => this._rootNodeID + name;
    return (
      <form
        className={'task task-form task-form-' + (editMode? 'edit' : 'create')}
        style={{backgroundColor: husl.toHex(this.state.hue, 67, 95)}}
        onSubmit={this.commit}>
        {this.labeledInput('duration', 'Time', {
          type: 'number',
          defaultValue: this.props.duration || 10,
          ref: 'dur'})}
        {this.labeledInput('project', 'Project', {
          type: 'text',
          defaultValue: this.props.project || 'personal',
          onKeyUp: this.typeProject,
          className: 'button inverse',
          style: {
            color: 'white',
            backgroundColor: husl.toHex(this.state.hue, 67, 58),
            borderColor: husl.toHex(this.state.hue, 67, 48),
            outline: 'none',
            cursor: 'text',
          },
          ref: 'project'})}
        {this.labeledInput('summary', 'Summary', {
          type: 'text',
          defaultValue: this.props.summary,
          ref: 'summary'})}
        {this.labeledInput('tags', 'Tags', {
          type: 'text',
          defaultValue: this.props.tags,
          ref: 'tags'})}
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
