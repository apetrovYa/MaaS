var React = require('react');
var Link = require('react-router').Link;

var Error404 = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Oops, page not found</p>
            <div id="error-404">
                <p>The page you're looking for doesn't exist.</p>
                <i id="alert"className="material-icons">&#xE002;</i>
                <div id="links">
                    <Link to="/">Back to the Home page</Link>
                </div>
            </div>
          </div>
    );
    }
});

module.exports = Error404;