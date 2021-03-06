var React = require('react');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

var DeleteUser = React.createClass({

    getInitialState: function() {
        
        return {
            id: UserStore.getId(),
            type : SessionStore.whoIam(),
            errors: []
        };
    },

    componentDidMount: function() {
        CompanyStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        CompanyStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({errors: CompanyStore.getErrors() || UserStore.getErrors()});
    },
    
    toggleDropdown: function(event) {
		event.preventDefault();
		if(this.state.errors.length > 0) {
		    this.refs.errorDropdown.classList.toggle("dropdown-show");
		} else {
		    this.refs.deleteDropdown.classList.toggle("dropdown-show");
		}
	},

    confirmDelete: function(event) {
       
        event.preventDefault();
        var email = this.props.email;
        var id = this.state.id;
        if(email != "" || id != "") {
            RequestUserActionCreator.deleteUser(email, id);
        } else {
            this.setState({ errors: "Error retrieving user id" });
        }
    },

    render: function() {
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
              <p id="errors">{this.state.errors}</p>
            );
        }
        return (
            <div id="delete-user" className="pop-up">
                <i onClick={this.toggleDropdown} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup" ref="errorDropdown">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="deleteDropdown">
                    <p className="dropdown-title">Delete user</p>
                    <div className="dropdown-description">
                        <p>Are you sure you want to delete</p>
                        <p><span id="successful-email">{this.props.email}</span>'s account?</p>
                    </div>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={this.confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DeleteUser;