var assign = require('object-assign');
var murmur = require('murmurhash-js/murmurhash3_gc');
var husl = require('husl');
var React = require('react');
var {addons: {PureRenderMixin}} = require('react/addons');
var {Link} = require('react-router');
var Reflux = require('reflux');
var actions = require('../actions');
var {config} = require('../stores');
var Icon = require('./icon.jsx');


function getHue(project, seed) {
  return murmur(project, seed) % 360;
}


var TagSet = React.createClass({
  mixins: [PureRenderMixin],
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

  mixins: [Reflux.listenTo(config, 'onConfigChange'), PureRenderMixin],

  onConfigChange(newConfig) {
    if (this.props.mode === 'create') { return; }
    this.setState({
      hue: getHue(this.props.project, newConfig.seed),
    });
  },

  getDefaultProps() {
    return {
      mode: 'display',
    };
  },

  getInitialState() {
    return {
      hue: this.props.mode === 'create' ? 160 : getHue(this.props.project, config.data.seed),
      editing: false,
    };
  },

  edit(e) {
    e && e.preventDefault();
    if (this.props.deleted) { return; }
    this.setState({editing: true});
  },

  stopEdit(e) {
    e && e.preventDefault();
    this.setState({editing: false});
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


    if (this.props.mode === 'display') {
      task.id = this.props.id;
      task.timestamp = this.props.timestamp;
      actions.tasks.update(this.props.id, task);
      this.stopEdit();
    } else {
      task.timestamp = (new Date()).getTime();  // timestamp
      actions.tasks.create(task);
    }
  },

  remove(e) {
    e && e.preventDefault();
    actions.tasks.remove(this.props.id);
  },

  reallyRemove(e) {
    e && e.preventDefault();
    actions.taskBackups.reallyRemove(this.props.id);
  },

  restore(e) {
    e && e.preventDefault();
    actions.taskBackups.restore(this.props.id);
  },

  typeProject(e) {
    var projInput = this.refs.project.getDOMNode();
    this.setState({hue: murmur(projInput.value) % 360});
  },

  renderDisplay() {
    var deleted = this.props.deleted;
    return (
      <div
        className={'task' + (deleted ? ' task-deleted' : '')}
        style={{
          color: husl.toHex(this.state.hue, 67, 7),
          backgroundColor: husl.toHex(this.state.hue, 67, 95)}}
        onDoubleClick={this.edit}>
        <div className="task-duration">
          <span className="task-duration-value">{this.props.duration}</span> mins
        </div>
        <div className="task-project">
          <Link
            className="button accent inverse bare"
            style={{backgroundColor: husl.toHex(this.state.hue, 67, 58)}}
            to="project"
            params={{project: this.props.project}}>
            {this.props.project}
          </Link>
        </div>
        <div className="task-summary">
          {this.props.summary}
        </div>
        <TagSet tags={this.props.tags} />
        {!deleted && (
          <div className="task-edit-buttons">
            <button className="button bare" onClick={this.edit} title="edit">
              <Icon id="pencil" alt="Edit task" />
            </button>
            <button className="button bare caution" onClick={this.remove} title="delete">
              &times;
            </button>
          </div>
        )}
        {deleted && (
          <div className="task-edit-buttons">
            <button className="button woo" onClick={this.restore} title="restore">
              restore
            </button>{' '}
            <button className="button caution" onClick={this.reallyRemove} title="delete">
              delete
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
    var editing = this.state.editing;
    return (
      <form
        className={'task task-form task-form-' + (editing? 'edit' : 'create')}
        style={{backgroundColor: husl.toHex(this.state.hue, 67, 95)}}
        onSubmit={this.commit}>
        {this.labeledInput('duration', 'Time', {
          type: 'number',
          defaultValue: this.props.duration || 10,
          ref: 'dur'})}
        {this.labeledInput('project', 'Project', {
          type: 'text',
          defaultValue: this.props.project || '',
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
          {editing && <button
            onClick={this.stopEdit}
            className="button"
            title="cancel">&times;</button>}
        </div>
      </form>
    );
  },

  render() {
    return {
      display: this.state.editing? this.renderForm() : this.renderDisplay(),
      create: this.renderForm(),
    }[this.props.mode];
  }
});


module.exports = Task;
