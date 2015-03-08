var React = require('react');
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
      id: 'download',
      url: 'http://thenounproject.com/term/saving/65894/',
      name: 'Download',
      creator: 'Stefan Parnarov',
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
  ],
};


var Footer = React.createClass({
  shouldComponentUpdate() {
    return false;
  },
  render() {
    return (
      <div className="footer">
        Icons:{' '}
        {credits.icons.map((i) => <span key={i.id}>
          <a href={i.url}><Icon id={i.id} alt={i.name + ' Icon'} /></a>
          {' '}&ndash; {i.creator}{' '}
        </span>)}
      </div>
    );
  },
});


module.exports = Footer;
