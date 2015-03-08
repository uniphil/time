var React = require('react');
var {addons: {PureRenderMixin}} = require('react/addons');


var Icon = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <svg
        className={'icon icon-' + this.props.id}
        alt={this.props.alt || this.title || 'icon ' + this.props.id}
        title={this.props.title || this.props.alt}
        dangerouslySetInnerHTML={{__html:
        '<use xlink:href="#' + this.props.id + '"></svg>'}}>
      </svg>
    );
  },
});


module.exports = Icon;
