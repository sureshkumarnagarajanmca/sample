var config = require('../../config');
var BaseService = require(config.app.root + '/api/services/BaseService.js');
//var accessControlService = require('./Administration/AccessControlService.js');
//var licenseEntitlementsService = require('./LicenseService/lib/GetLicenseEntitlements.js');
//var rolesService = require('./Administration/RolesService');
var Promise = require('bluebird');
//var eDiscoveryService = require(config.app.root + '/api/services/EDiscoveryService');


function AppControlListService() {
	BaseService.call(this);
}

AppControlListService.prototype.getAppControlList = function(userId, orgId,callback) {
	
    var rolesServiceInst = rolesService.getInst();
    rolesServiceInst.setUserContext(this.getUserContext());
    var licenseEntitlementsServiceInst = licenseEntitlementsService.getInst();
    licenseEntitlementsServiceInst.setUserContext(this.getUserContext());
    var accessControlServiceInst = accessControlService.getInst();
    accessControlServiceInst.setUserContext(this.getUserContext());
    var eDiscoveryServiceInst = eDiscoveryService.getInst();
    eDiscoveryServiceInst.setUserContext(this.getUserContext());

    var appCtrls ={};
    appCtrls.permissions = [];
    appCtrls.applicationControl = [];
    appCtrls.roles = [];
    appCtrls.eDiscovery = [];
    return new Promise(function(resolve,reject){
        licenseEntitlementsServiceInst.getLicenseEntitlements(userId, function(err, licenseEntitlements){
            if(err){
                AppLogger.log("AppControlListService: err in getting LicenseEnt for "+userId);
                return reject(err);
            }
            if(licenseEntitlements)
            appCtrls.licenses = licenseEntitlements;
            resolve();
        });
    })
    .then(function(){
        return new Promise(function(resolve,reject){
            rolesServiceInst.getRolesOfUsers(orgId, [userId], function(err, rolesOfUser){
                if(err){
                    AppLogger.log("AppControlListService: err in getting roles for "+userId);
                    return reject(err);
                }
                if(rolesOfUser)
                rolesOfUser.forEach(function(roleItem){
                    if(appCtrls.roles.indexOf(roleItem.role) === -1){
                        appCtrls.roles.push(roleItem.role);
                    }
                    for(var prop in roleItem.permissions){
                        if(roleItem.permissions[prop] != 0){
                            if(appCtrls.permissions.indexOf(prop) === -1){
                                appCtrls.permissions.push(prop);
                            }
                        }
                    }
                });
                resolve();
            });
        });
    })
    .then(function(){
        return new Promise(function(resolve,reject){
            accessControlServiceInst.getAccessControlOfUser(orgId, userId, {projection:{permissions:1}},function(err, templRecords){
                var disabledPermissions = [];
                if(err){
                    AppLogger.log("AppControlListService: err in getting ACls for "+userId);
                    return reject(err);
                }
                if(templRecords && templRecords.length){
                    templRecords.forEach(function(acctem){
                        for(var per in acctem.permissions){
                            if(acctem.permissions[per] == 1){
                                if(appCtrls.applicationControl.indexOf(per) === -1)
                                    appCtrls.applicationControl.push(per);
                            }
                            else{
                                disabledPermissions.push(per);
                            }
                        }
                    });
                    var permissionsArr = [];
                    appCtrls.applicationControl.forEach(function(per){
                        if(disabledPermissions.indexOf(per) === -1)
                            permissionsArr.push(per);
                    });
                    appCtrls.applicationControl = permissionsArr;
                }
                resolve();
            });
        });
    })
    .then(function(){
        return new Promise(function(resolve,reject){
            eDiscoveryServiceInst.readEDiscoveryPoliciesForUser(orgId, function(err, eDiscoveryTemplates){
                if(err){
                    AppLogger.log("AppControlListService: err in getting eDiscoveryService for "+userId);
                    return reject(err);
                }
                if(eDiscoveryTemplates && eDiscoveryTemplates.length){
                    appCtrls.eDiscovery = ["VIEW_EDISCOVERY"];
                    appCtrls.permissions.push("VIEW_EDISCOVERY");
                }                
                resolve();
            });
        });
    })
    .then(function(){
        callback(null,appCtrls);
    })
    .then(null,function(){
        callback(null,appCtrls);
    });

};


module.exports = {
    getInst: function() {
        return new AppControlListService();
    }
};
