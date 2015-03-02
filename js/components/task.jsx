var React = require('react');
var {Link} = require('react-router');
var actions = require('../actions');


var TagSet = React.createClass({
  render() {
    var tags = this.props.tags,
        style = {
          tag: {
            display: 'inline-block',
            padding: '0 5px',
            fontSize: '0.8em',
            borderRadius: '5px',
            color: 'hsl(280, 60%, 95%)',
            textDecoration: 'none',
            background: 'hsl(280, 60%, 60%)',
          },
          sep: {
            display: 'inline-block',
            color: 'transparent',
            width: '4px',
          }
        }
    return (
      <span>
        {tags.map((tag, i) => (
          <span key={tag}>
            <Link
              style={style.tag}
              to="tag"
              params={{tag: tag}}>
              {tag}
            </Link>
            {i < tags.length-1 ? <span style={style.sep}>, </span> : ''}
          </span>
        ))}
      </span>
    );
  },
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
    var editable = this.props.editable;
    return (
      <span style={{background: this.props.pending ? '#ff9' : 'transparent'}}>
        <strong>{this.props.duration}</strong> mins
        {' '}
        <Link to="project" params={{project: this.props.project}}>{this.props.project}</Link>
        {' '}
        <Link to="task" params={{taskId: this.props.id}}>{this.props.summary}</Link>
        {' '}
        <TagSet tags={this.props.tags} />
        {' '}
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
          <input type="number" defaultValue={this.props.duration || 0} ref="dur" />
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
