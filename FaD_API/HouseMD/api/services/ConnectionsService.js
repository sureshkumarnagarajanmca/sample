var BaseService = require('./BaseService.js');
var IdProxyServiceModule = require('./IdProxyService.js');
var Promise = require('bluebird');
function ConnectionsService(usercontext) {
    BaseService.call(this);
    this.setUserContext(usercontext);
    this.model = this.modelfactory.getUserModelEmmitable(this);
    this.idproxyService = IdProxyServiceModule.getInst(usercontext);
}

ConnectionsService.prototype.updateConnection = function(userId , connectionInfo , callback){
    connectionInfo.identity = connectionInfo.emailId || connectionInfo.phoneNo;
    this.model.updateConnection(userId , connectionInfo)
    .then(function(){
        callback(null);
    })
    .then(null,callback);
};

ConnectionsService.prototype.getConnection = function(userId , connectionInfo){

};

ConnectionsService.prototype.sanitize = function(connection){
    var returnObj = {
        name : connection.name,
        identity : connection.identity,
        accessToken : connection.accessToken
    };
    if(connection.spSiteUrl)
        returnObj.sharepointTenant = connection.spSiteUrl;
    return returnObj;
};

ConnectionsService.prototype.getConnections = function(userId , connectionInfo , callback){
    connectionInfo = connectionInfo ||{};
    connectionInfo.identity = connectionInfo.identity ;

    this.model.getConnections(userId , connectionInfo)
    .then(function(connections){
        callback(null , connections);
    })
    .then(null,callback);
};

ConnectionsService.prototype.getConnectionsInfo = function(userId , connectionInfo , callback){
    var self = this;
    this.getConnections(userId, connectionInfo , function(err , connections){
        if(!err)
            connections = connections.map(self.sanitize);
        callback(err , connections);
    });
};
ConnectionsService.prototype.deleteConnections = function(userId,connectionInfo,callback){
    var self = this;
    this.model.deleteConnection(userId,connectionInfo)
    .then(function(){
            callback(null);
    })
    .then(null,callback);
};

function NotFoundError(e){
    return e.message === "500" || (e.cause?((e.cause.code === 'ECONNREFUSED')?true:false):false);
}

ConnectionsService.prototype.renewConnection = function(userId, connectionInfo){
    var self = this;
    return new Promise(function(resolve,reject){
        Promise.promisify(self.idproxyService.renewConnection)(connectionInfo)
        .then(function(res){
            res.name = res.name || res.idp;
            if(!res.refreshToken)
                res.refreshToken = connectionInfo.refreshToken;
           self.updateConnection(userId,res,function(err,result){
                if(err)
                    reject(err);
                else
                    resolve(res);
            });
        })
        .catch(NotFoundError,function(e){
            reject(new Error("401"));
        })
        .then(null,function(err){
            reject(err);
        })
    });
};

module.exports = {
    getInst: function(usercontext) {
        return new ConnectionsService(usercontext);
    }
};
