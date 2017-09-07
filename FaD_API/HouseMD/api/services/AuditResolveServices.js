var Promise = require('bluebird');
var BaseService = require('./BaseService.js');
//var BaseService = require(config.app.root + '/api/services/BaseService.js');
var ModelFactory = appGlobals.ModelFactory;
//var errors = config.errors;
var inherits = require('util').inherits;

function AuditResolveService() {
    BaseService.call(this);
}

inherits(AuditResolveService , BaseService);

AuditResolveService.prototype.user = function (userIds) {
    var self=this,users=[];
    //console.log("insde of resolve user function",userIds);
    if (!userIds) return Promise.resolve([]);
    users = (Array.isArray(userIds)) ? userIds : [userIds];
    var contextProvider = appGlobals.ContextProvider.getInst(self.getUserContext());

    var userModeInst = ModelFactory.getUserModelEmmitable(contextProvider);
        return userModeInst.getUserInfoByUserIds(users)
        .then(function ( userRecs){
            users=[];
            userRecs.forEach(function(userRec){
                users.push({
                    id:userRec._id,
                    firstName:userRec.firstName || userRec.emailId || userRec.phoneNo,
                    lastName:userRec.lastName || ""
                });
            });
            return users;
        })
        .then(null, function (err) {
            return Promise.resolve(userIds);
        });
    
};

/**
 * This method resolve thge group by Id
 * @param  {[string]} groupIds [array of group Ids]
 * @return {[group obj]}          [description]
 */
AuditResolveService.prototype.group = function (groupIds) {
    var self=this,groups=[];
    var matchCnd={};
    var contextProvider = appGlobals.ContextProvider.getInst(self.getUserContext());
    var orgGroupModelInst = ModelFactory.getOrgGroupModel(contextProvider); 

    if (!groupIds) return Promise.resolve([]);
    groupIds = (Array.isArray(groupIds)) ? groupIds : [groupIds];
   
    matchCnd._id = {$in:groupIds};

    return new Promise(function(resolve,reject){
        orgGroupModelInst.getOrganizationGroupDetail(matchCnd, function(err,groupRecs) {    
            if (err){
                return resolve(groupIds);    
            }
            groupRecs.forEach(function(groupRec){
                groups.push({
                    id:groupRec._id,
                    name:groupRec.gN
                });
            });
            return resolve(groups);
        });
    });    
};


AuditResolveService.prototype.owner = function (userIds) {
    var self=this,users=[];
    //console.log("insde of resolve user function",userIds);
    if (!userIds) return Promise.resolve([]);
    users = (Array.isArray(userIds)) ? userIds : [userIds];
    
    return this.user(users[0].id);

};

module.exports = {
    getInst: function () {
        return new AuditResolveService();
    }
};
