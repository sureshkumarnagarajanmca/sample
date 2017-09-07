/**
 * This file handles the connection with Database and provides functions to CRUD
 * database records
 *
 * @author client
 * @date 26-04-2012
 * @version {@@version}
 */
var config = require('../config');
// Imports
var mongoose = require('mongoose'),
    _dbConf = config.db,
    app = config.app,
    fs = require('fs'),
    connCache = {};

/**
 * This function boots schemas from 'dbModels' directory
 */
function _bootSchemas(context) {
    var dir = __dirname + '/dbModels';
    console.log('__dirname'+__dirname);
    // grab a list of our route files        
    //require(dir + '/GlobalStructs.js').loadSchemas(context.Schema, context.db);
    //require(dir + '/TopicGlobal.js').loadSchemas(context.Schema, context.db);
    fs.readdirSync(dir).forEach(function(file) {
        if (file.indexOf('.svn') > -1 || file.indexOf('GlobalStruct') > -1 || file.indexOf('TopicGlobal') > -1) {
            return;
        }
       console.log( file );
        require(dir + '/' + file)(context.Schema, context.db);
    });
}

function DBManager() {}

function getConnectionInCache(connStr) {
    return connCache[connStr];
}

function addToConnectionCache(connStr, _connection) {
    connCache[connStr] = _connection;
}

function addWriteConcern(connStr) {
    if (config.db.writeconcern !== 1)
        return connStr + '?w=' + config.db.writeconcern;
    else
        return connStr;
}

DBManager.prototype = {
    /**
     * This function initiates the database by loading the schemas into Mongoose
     * Instance
     */
    initiateDB: function(callback) {
        _bootSchemas({
            'db': mongoose,
            'Schema': mongoose.Schema
        });
        //var model = this.getModel('DBVersions');
        /*model.find({}, null, {'sort': {'versionNo': -1}, 'limit': 1}, function (err, docs) {
            if(err) {
                console.log('Unable to read db version.');
                AppLogger.error(err);
                process.exit(78);
            }
            
            if (docs.length < 1) {
                console.log('DB does not exist.');
                AppLogger.error('DB does not exist.');
                callback(new Error('db does not exists'));
            }
            else if(app.requiredVersion !== docs[0].versionNo) {
                console.log('Required DB version for application does not match DB\'s current version');
                AppLogger.error('Required DB version for application does not match DB\'s current version');
                callback(new Error('Required DB version for application does not match DB\'s current version'));
            }
            else {
                console.log('Required DB version for application matched DB\'s current version');
                AppLogger.info('Required DB version for application matched DB\'s current version');
                callback(null);
            }
        });*/
    },

    /**
     * This function returns the connection object by creating connection with
     * Mongo DB.
     */
    getConnection: function() {
        // Connection string
        //console.log("*** obtaining connection!! ");
        var _connStr, hostEntries, portEntries, _connection;
        if (_dbConf.replEnabled === 'true' || _dbConf.replEnabled === true) {
            hostEntries = _dbConf.hosts;
            portEntries = _dbConf.ports;
            //console.log("*** hostEntries -->" + hostEntries);
            //console.log("*** portEntries -->" + portEntries);

            _connStr = 'mongodb://' + hostEntries[0] + ':' + portEntries[0] + '/' + _dbConf.database + ',mongodb://' + hostEntries[1] + ':' + portEntries[1] + '/' + _dbConf.database + ',mongodb://' + hostEntries[2] + ':' + portEntries[2] + '/' + _dbConf.database;
            //console.log("*** _connStr for replica set -->" + _connStr);
            if (!this._conn) {
                //this._conn = mongoose.connect(_connStr);
                this._conn = mongoose.createConnection(_connStr);
            }
        } else {
            _connStr = 'mongodb://' + _dbConf.host + ':' + _dbConf.port + '/' + _dbConf.database;
            //console.log("*** _connStr for normal mongo set -->" + _connStr);
            if (!this._conn) {
                this._conn = mongoose.createConnection(_connStr, {auto_reconnect: true, socketOptions: {keepAlive: 100}});
                //this._conn = mongoose.connect(_connStr);
                connCache 
            }
        }

        _connection = getConnectionInCache(_connStr);
        if (_connection) {
            return _connection;
        }

        _connection = mongoose.createConnection(addWriteConcern(_connStr));

        addToConnectionCache(_connStr, _connection);

        return _connection;


        //return (this._conn);
    },

    /**
     * This function releases the connection object by closing connection with
     * Mongo DB.
     */
    closeConnection: function() {
        if (this._conn) {
            this._conn.close();
        }
    },

    /**
     * This method returns the Model matching the name *
     *
     * @param modelName
     */
    getModel: function(modelName) {
        return this.getConnection().model(modelName);
    },



    //////////////////////////////////// Tenant connection related methods //////////////////////////////

    /**
     * Method to create tenant specific database connection
     * @param datasource
     *      datasource should URI string
     *
     * returns tenant specific database connection
     */
    getTenantConnection: function(datasource) {
        //console.log('obtaining Tenant Connection........');

        var _tenantConnStr = '',
            _connection;

        //replica set
        if (datasource.length > 1) {
            datasource.forEach(function(uri) {
                _tenantConnStr = _tenantConnStr + uri + ',';
            });
            _tenantConnStr = _tenantConnStr.slice(1, -1);
        } else {
            _tenantConnStr = datasource[0];
        }
        //console.log("*** tenantConnection str for normal mongo set -->" + _tenantConnStr);	

        _connection = getConnectionInCache(_tenantConnStr);
        if (_connection) {
            return _connection;
        }
        _connection = mongoose.createConnection(addWriteConcern(_tenantConnStr));

        addToConnectionCache(_tenantConnStr, _connection);

        return _connection;

        /*if (!this._tenantConn) {
            this._tenantConn = mongoose.createConnection(_tenantConnStr,{auto_reconnect: true, socketOptions: {keepAlive: 100}});
        }
        return this._tenantConn;*/

    },

    /**
     * This method returns the Model matching the datasource*
     *
     * @param modelName
     * @param datasource
     */
    getTenantModel: function(modelName, datasource) {
        return this.getTenantConnection(datasource).model(modelName);

    },

    /**
     * This function releases the database connection in Mongo DB.
     *
     */
    closeTenantConnection: function(tenantConn) {
        if (tenantConn) {
            tenantConn.close();
        }
    }


};
module.exports = {
    'getInst': function() {
        return (new DBManager());
    }
};
