var React = require('react');
var {Link} = require('react-router');
var Tag = require('./tag.jsx');
var NotFound = require('./not-found.jsx');


var TagDetail = React.createClass({
  render() {
    var tag = this.props.params.tag;
    var tasks = this.props.tasks.filter((t) => t.tags.some((t) => t === tag));
    if (tasks.length === 0) { return <NotFound />; }
    return (
      <div>
        <h3>Tag: {tag}</h3>
        <Tag name={tag} tasks={tasks} list={true} />
        <p><Link to="home">home</Link></p>
      </div>
    );
  }
});


module.exports = TagDetail;
