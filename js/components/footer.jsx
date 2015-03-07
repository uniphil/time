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
      id: 'pencil',
      url: 'http://thenounproject.com/term/edit/99661/',
      name: 'Pencil',
      creator: 'Mira Bear',
      license: 'CC-BY-3.0',
      source: 'The Noun Project',
    }
  ],
};


var Footer = React.createClass({
  render() {
    return (
      <div className="footer">
        Icon credits:{' '}
        {credits.icons.map((i) => <span key={i.id}>
          <a href={i.url}><Icon id={i.id} alt={i.name + ' Icon'} /></a>
          {' '}&ndash; {i.creator} via {i.source}{' '}
        </span>)}
      </div>
    );
  },
});


module.exports = Footer;
