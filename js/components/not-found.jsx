var React = require('react');
var {Link} = require('react-router');


var NotFound = React.createClass({
  render() {
    return (
      <div>
        <h3>Not Found :(</h3>
        {this.props.message && <p>{this.props.message}</p>}
        <p><Link to="home">home</Link></p>
      </div>
    );
  },
});


module.exports = NotFound;
