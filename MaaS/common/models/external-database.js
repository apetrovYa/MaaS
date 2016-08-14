// Name: {external-database.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://');

// module.exports = {
//     'url' : ''
// }

var app = require('../../server/server.js');
var mongoose = require('mongoose');

module.exports = function(ExternalDatabase) {
    ExternalDatabase.addExtDb = function(companyId, name, connString, cb) {
        if(companyId && name != "" && connString != "")
        {
            var Company = app.models.Company;
            Company.findById(companyId, function(err, companyInstance) {
                if(err)
                {
                    var error = {
                        message: "Company not found"
                    };
                    console.log('> Company not found.');
                    return cb(null, error, null);
                }
                
                // verify connectivity
                //var conn = mongoose.createConnection(connString);
                var conn = mongoose.connect(connString, function(err) {
                    if (err)
                    {
                        var error = {
                            message: "Failed connecting database"
                        };
                        console.log('> Failed connecting database.');
                        return cb(null, error, null);
                    }
                    // Create database
                    ExternalDatabase.create({name: name, connString: connString, companyId: companyInstance.id}, function(err, externalDatabaseInstance){
                        if(err)
                        {
                            ExternalDatabase.destroyById(externalDatabaseInstance.id);
                            var error = {
                                message: "Failed creating database"
                            };
                            console.log('> Failed creating database.');
                            return cb(null, error, null);
                        }
                        else
                        {
                            console.log("> Database added:", externalDatabaseInstance);
                            return cb(null, null, externalDatabaseInstance);
                        }
                    });
                });
                //mongoose.connection.close();
                conn.disconnect();
            });
        }
        else
        {
            console.log('> failed creating database, required fields are missing.');
            var err = {
                    message: 'Missing required values'
                };
            return cb(err);
        }
    };
    
    ExternalDatabase.remoteMethod(
        'addExtDb',
        {
            description: 'Adds an external database to the company.',
            accepts: [
                { arg: 'companyId', type: 'string', required: true, description: 'Company Id'},
                { arg: 'name', type: 'string', required: true, description: 'Database name'},
                { arg: 'connString', type: 'string', required: true, description: 'Connection string'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'database', type: 'Object'}
            ],
            http: { verb: 'post', path: '/addExtDb' }
        }
    );
};