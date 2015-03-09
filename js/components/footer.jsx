var React = require('react');
var Icon = require('./icon.jsx');


var credits = {
  icons: [
    {
      license: 'Public Domain',
      icons: [
        {
          id: 'gear',
          url: 'http://thenounproject.com/term/mechanical/1241/',
          name: 'Gear',
          creator: 'Johan H. W. Basberg',
          source: 'The Noun Project',
        },
        {
          id: 'trash',
          url: 'http://thenounproject.com/term/trash/5109/',
          name: 'Deleted',
          creator: 'Karthick Nagarajan',
          source: 'The Noun Project',
        },
      ],
    },
    {
      license: 'CC-BY-3.0',
      icons: [
        {
          id: 'export',
          url: 'http://thenounproject.com/term/share/79596/',
          name: 'Export',
          creator: 'Riley Isawesome',
          source: 'The Noun Project',
        },
        {
          id: 'pencil',
          url: 'http://thenounproject.com/term/edit/99661/',
          name: 'Pencil',
          creator: 'Mira Bear',
          source: 'The Noun Project',
        },
      ],
    },
  ],
};


var Footer = React.createClass({
  shouldComponentUpdate() {
    return false;
  },
  render() {
    return (
      <div className="footer">
        {credits.icons.map((g) => <span key={g.license}>
          <strong>{g.license}:</strong>
          {g.icons.map((i) => <a
            href={i.url}
            key={i.id}
            className="button bare"
            title={g.license}>
            <Icon
              id={i.id}
              alt={i.name + ' Icon'} /> {i.creator}
          </a>)}
        </span>)}
      </div>
    );
  },
});


module.exports = Footer;
