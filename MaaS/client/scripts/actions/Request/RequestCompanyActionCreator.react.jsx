// Name: {RequestCompanyActionCreator.react.jsx}
// Module: {ActionCreators}
// Location: {/MaaS/client/scripts/actions/Request/}

// History:
// Version         Date            Programmer
// ==========================================

var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/CompanyWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;

var CompanyActionCreator = {
    getUsers: function(id) {
        WebAPIUtils.getUsers(id);
    },

};

module.exports = CompanyActionCreator;