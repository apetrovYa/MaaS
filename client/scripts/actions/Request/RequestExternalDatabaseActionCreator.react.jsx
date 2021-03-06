var Dispatcher = require("../../dispatcher/Dispatcher.js");
var WebAPIUtils = require("../../utils/ExternalDatabaseWebAPIUtils.js");
var Constants = require("../../constants/Constants.js");

var ActionTypes = Constants.ActionTypes;


var RequestExternalDatabaseActionCreator = {
    addExtDb: function(companyId, name, connString) {
        WebAPIUtils.addExtDb(companyId, name, connString);
    },
    
    getDbs: function(id) {
        WebAPIUtils.getDbs(id);
    },
    
    deleteDb: function(id, companyId) {
        WebAPIUtils.deleteDb(id, companyId);
    },
    
    deleteAllSelectedDatabases: function(companyId, arrayId) {
        WebAPIUtils.deleteAllSelectedDatabases(companyId, arrayId);
    },
    
    changeStateDb: function(id, status, companyId) {
        WebAPIUtils.changeStateDb(id, status, companyId);
    }
};

module.exports = RequestExternalDatabaseActionCreator;