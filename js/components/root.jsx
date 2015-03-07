var React = require('react');
var Reflux = require('reflux');
var {Link, RouteHandler} = require('react-router');
var stores = require('../stores');
var actions = require('../actions');
var c = require('../constants');

var Header = require('./header.jsx');
var Footer = require('./footer.jsx');


var Root = React.createClass({

  mixins: [Reflux.connect(stores.tasks)],

  componentWillMount() {
    actions.tasks.load();
  },

  render() {
    return (
      <div className="app">
        <Header tasks={this.state.ls} />
        {this.state.status({
          Ok: () => <RouteHandler {...this.props} tasks={this.state.ls} />,
          Err: (why) => {
            if (why === c.NOT_LOADED) {
              return <p>'not loaded'</p>;
            } else if (why === c.LOADING) {
              return <p>'loading...'</p>;
            } else if (why === c.LOAD_FAILED) {
              return <p>'load failed :('</p>;
            } else {
              return <p>'tasks didn\'t load...'</p>;
            }
          },
        })}
        <Footer />
      </div>
    );
  }
});


module.exports = Root;
