var React = require('react');


var Icon = React.createClass({
  render() {
    return (
      <svg
        className={'icon icon-' + this.props.id}
        alt={this.props.alt}
        title={this.props.title || this.props.alt}
        dangerouslySetInnerHTML={{__html:
        '<use xlink:href="#' + this.props.id + '"></svg>'}}>
      </svg>
    );
  },
});


module.exports = Icon;
