/*global AuditLogger*/
var config = require('../../config');
var	BaseService = require(config.app.root + '/api/services/BaseService.js');
var inherits = require('util').inherits;
var auditservice;
var _ = require('lodash');
var Promise = require('bluebird');



function getClientIp(req){
    var xFwdIp=req.headers['x_forwarded_for'];
    var conRemoteIp=req.connection && req.connection.remoteAddress;
    var socketRemoteIp=req.socket && req.socket.remoteAddress;
    var conSocketRemoteIp=req.connection && req.connection.socket && req.connection.socket.remoteAddress;
    var xRealIp=req.headers['x-real-ip'],fwdIpArr;
    var xClientIp=req.headers['X-Client-IP'];
    
    var clientIp=null;
        if(xRealIp){
            clientIp=xRealIp.trim();
        }
        if(!clientIp && xClientIp){
            clientIp=xClientIp.trim();
        }
        if(!clientIp && xFwdIp){
            fwdIpArr=xFwdIp.split(",");
            if(fwdIpArr && fwdIpArr.length>0){
                clientIp=fwdIpArr[0] && fwdIpArr[0].trim();
            }
        }
        
        if(!clientIp && conRemoteIp){
            clientIp=conRemoteIp.trim();
        }
        if(!clientIp && socketRemoteIp){
            clientIp=socketRemoteIp.trim();
        }
        if(!clientIp && conSocketRemoteIp){
            clientIp=conSocketRemoteIp.trim();
        }        
        
    return clientIp;
}

function AuditEvent(req ,clientevent){
    var usercontext, endpoint;
    usercontext = req.userContext||{};
    
    this.audit ={
        "@timestamp": new Date(),
        "@version": config.app.commit, //the commit currently running
        "@clientversion": req.headers['x-app-version'],
        "hostname": req.hostname,
        "clientIp": getClientIp(req),
        "http_user_agent": req.headers['user-agent'],
        "clientId": usercontext.clientId,
        "tenantId": usercontext.tenantId || usercontext.orgId,
        "orgId": usercontext.orgId,
        "userId": usercontext.userId,
        "owner": [{id:usercontext.userId}],
        "teamId": (usercontext.team && usercontext.team.teamId) || (req.param && req.param.teamId)
    };

    this.setclientEvent = function(clientevent){
        this.audit = _.assign(this.audit,clientevent);
        endpoint = resourceEndpoints.match(req);
        if (!endpoint) {
            this.audit.request = req.url;
            this.audit.action = req.method;
        }
    };
    
    this.setEvent = function(){
        endpoint = resourceEndpoints.match(req);
        if (endpoint) {
            this.audit.resource = endpoint.options.resource;
            this.audit.action = endpoint.options.action;
            this.audit.event = endpoint.options.event;
            this.audit.category = endpoint.options.category;
        } else { 
            this.audit.request = req.url;
            this.audit.action = req.method;
        }
    };
        
    if(clientevent)
        this.setclientEvent(clientevent);
    else 
        this.setEvent();
}

function AuditService() {
	BaseService.call(this);
}
inherits(AuditService , BaseService);

/*function ceeaugmentation(loggerinst){
    loggerinst.cee = function(msg){
        this.instance.log("@cee" , msg);
    };
}
ceeaugmentation(AuditLogger);*/

AuditService.prototype.audit = function(event , callback){
    AuditLogger.cee(JSON.stringify(event) , callback);
};

auditservice = module.exports = new AuditService();

function audit(req,res) {
    //console.log(req);  // commented for temporary
    if (res.clientevent && res.clientevent.length){
        res.clientevent.forEach(function(event){
            var auditEvent = new AuditEvent(req); 
            if(event){
                event.setUserContexts(auditEvent.audit)
                .then(function(){
                    return event.toResolve();
                })
                .then(function(eventData){
                     auditEvent.audit = _.assign(auditEvent.audit,eventData);
                     auditservice.audit(auditEvent.audit);
                     return Promise.resolve();
                });
            }else{
                console.log("event not audited");
            }
        });
    }else{
        var auditEvent = new AuditEvent(req); 
         auditservice.audit(auditEvent.audit);
    }
}


/**
 * express middleware , audits successful responses
 * @param  {express.request}    req
 * @param  {express.response}   res
 * @param  {Function}           next express middleware's free variable
 * @return {void}
 */
module.exports.middleware = function(req, res, next) {
    req._startTime = new Date();
    var endpoint = resourceEndpoints.match(req);
    res.on('finish', function() {
        if (res.statusCode === 200 &&
//            (req.userContext  || (req.options && req.options.audit === true)) &&  
            (req.method !== 'GET' ||  (endpoint && endpoint.options && endpoint.options.audit === true))) {
            try {
                audit(req,res);
            } catch (e) {
                AppLogger.error(e.stack);
            }
        }
    });
    next();
};