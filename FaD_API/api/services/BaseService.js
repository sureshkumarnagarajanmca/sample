/*global _appConsts, appGlobals*/
var config = require('../../config');
var AuditEvent = require(config.app.root + '/api/event');

function BaseService() {
    var userContext, auditLogger ,contextProvider,audit=[];
    this.clientEventFactory = AuditEvent;
    this.modelfactory = appGlobals.ModelFactory;
    /* user context object holds tenantId, userId, datasource */
    this.setUserContext = function(_userContext) {
        userContext = _userContext;
        this.setContextProvider(_userContext);
    };
    this.getUserContext = function() {
        return userContext;
    };

    this.getDatasource = function() {
        return userContext.datasource;
    };

    this.setAuditLogger = function(_logger) {
        auditLogger = _logger;
    };

    this.getAuditLogger = function() {
        return auditLogger;
    };
    this.setUserContextByDomain = function(_domain, callback) {
        var _authenticatorInst = require(config.app.root + '/security/Authenticator.js').getInst(),
            _scope = this;
        _authenticatorInst.getTenantDataSource(_domain, function(status, accRec) {
            var _userContext = {
                tenantId: accRec._id,
                datasource: accRec.datasource
            };
            _scope.setUserContext(_userContext);
            callback();
        });
    };

    this.toJSON = function() {
        return userContext;
    };

    /*
     * Set context
     * @param {Object literal }contextObj
     *
     * {
     *     userContext :{
     *          storageContext:{
     *              <StorageTypeConstant> :{
     *
     *              },
     *              //ex
     *              s3:{
     *
     *
     *              }
     *          }
     *     }
     *
     *
     */
    this.setContextProvider = function(contextObj){
        contextProvider = appGlobals.ContextProvider.getInst(contextObj);
    };

    this.getContextProvider = function(){
        return contextProvider;
    };
    this.getEvent = function(){
        return audit;
    };
    this.prepareAndSetEvent = function(name,data){
        var auditevent;//function(){};
        if(this.clientEventFactory[name])
            auditevent = new this.clientEventFactory[name](data);
        audit.push(auditevent);
    };
    this.setEvent = function(auditevent){
        audit = auditevent;
    };
}

module.exports = BaseService;
