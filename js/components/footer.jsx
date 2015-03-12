var React = require('react');
var {addons: {PureRenderMixin}} = require('react/addons');
var Icon = require('./icon.jsx');


var credits = {
  icons: [
    {
      id: 'gear',
      url: 'http://thenounproject.com/term/mechanical/1241/',
      name: 'Gear',
      creator: 'Johan H. W. Basberg',
      license: 'Public Domain',
      source: 'The Noun Project',
    },
    {
      id: 'trash',
      url: 'http://thenounproject.com/term/trash/5109/',
      name: 'Deleted',
      creator: 'Karthick Nagarajan',
      license: 'Public Domain',
      source: 'The Noun Project',
    },
    {
      id: 'export',
      url: 'http://thenounproject.com/term/share/79596/',
      name: 'Export',
      creator: 'Riley Isawesome',
      license: 'CC-BY-3.0',
      source: 'The Noun Project',
    },
    {
      id: 'pencil',
      url: 'http://thenounproject.com/term/edit/99661/',
      name: 'Pencil',
      creator: 'Mira Bear',
      license: 'CC-BY-3.0',
      source: 'The Noun Project',
    },
    {
      id: 'swap',
      url: 'http://thenounproject.com/term/movement/63536/',
      name: 'Arrows',
      creator: 'Zlatko Najdenovski',
      license: 'CC-BY-3.0',
      source: 'The Noun Project',
    },
    {
      id: 'external-link',
      url: 'http://thenounproject.com/term/hyperlink/16896/',
      name: 'External Link',
      creator: 'Juan Garces',
      license: 'CC-BY-3.0',
      source: 'The Noun Project',
    },
  ],
};


var IcoButton = React.createClass({

  getInitialState() {
    return {expanded: false};
  },

  toggle(e) {
    this.setState({expanded: !this.state.expanded});
  },

  render() {
    return (
      <span className={'icon credit' + (this.state.expanded ? ' expanded' : '')}>
        <button
          className="button"
          onClick={this.toggle}>
          <Icon id={this.props.id} />
          {this.state.expanded && (
            <span> {this.props.creator} ({this.props.license})
              {' '}
              <a
                href={this.props.url}
                target="_blank"
                className="button inverse accent">
                <Icon id="external-link" />
              </a>
            </span>
          )}
        </button>
      </span>
    );
  }

});


var Footer = React.createClass({

  shouldComponentUpdate() {
    return false;
  },

  render() {
    return (
      <div className="footer">
        icon credits:{' '}
        {credits.icons.map((i) => <IcoButton key={i.id} {...i} />)}
      </div>
    );
  },

});


module.exports = Footer;
