// Name: {ResponseSessionActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Response/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var ResponseSessionActionCreator = {
    responseSignup: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.SIGNUP_RESPONSE,
            json: json,
            errors: errors
        });
    },
    responseLogin: function(json, errors) {
        Dispatcher.handleServerAction({
            type: ActionTypes.LOGIN_RESPONSE,
            json: json,
            errors: errors
        });
    },
    responseInvite: function(errors, email) {
        Dispatcher.handleServerAction({
           type: ActionTypes.INVITE_RESPONSE,
           errors: errors,
           email: email
        });
    }
};

module.exports = ResponseSessionActionCreator;