var React = require('react');
var Task = require('./task.jsx');


var Header = React.createClass({
  render() {
    return (
      <div style={{
        padding: '1em',
        background: 'hsl(280, 60%, 95%)',
      }}>
        <Task asForm={true} formMode="create" />
      </div>
    );
  },
});


module.exports = Header;
