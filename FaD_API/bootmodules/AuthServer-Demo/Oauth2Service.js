/*global config, appGlobals*/
var ClientService = require('./lib/ClientService.js'),
    AuthService = require('./lib/AuthorizationService.js'),
    TokenService = require('./lib/TokenService.js'),
    AuthenticatorInst = require('../../security/Authenticator').getInst(),
    UserService = require('../../api/services/UserService').getInst(),
    ModelFactory = appGlobals.ModelFactory;

var cache = false,
    backCompatible = config.auth.backCompatible;


function Oauth2Service() {

    this.sanitize = function(tokendata){
        return AuthService().sanitizeaccesstoken(tokendata);
    };

    this.getAcctDet = function(dName, cb) {
        var domainName = dName;

        var accModel = ModelFactory.getAccountModel();
        accModel.on('AccRecordFindError', function(Err) {
            cb(Err);
        });

        accModel.on('AccRecordsFound', function(Rec) {
            cb(Rec);
        });
        accModel.on('AccRecordsNotFound', function() {
            cb("No record found");
        });

        accModel.findAccountByDomain([domainName]);
    };

    this.createToken = function(req,clientId, username, password, scope, isSAMLReq, cb, bcb) {
        if (!bcb) {
            bcb = cb;
            cb = isSAMLReq;
        }

        AuthenticatorInst.login(username, username, password, isSAMLReq, function(result, userInst) {
            if (result === 'AuthenticationError') {
                if (!backCompatible) {
                    cb('AuthenticationError', userInst);
                } else {
                    bcb('AuthenticationError', userInst);
                }

            } else {

                var tokenData = prepareToken(req,userInst, clientId);
                AuthService().saveAccessToken(tokenData, function(savedtokenData) {
                    sanitizeToken(tokenData);
                    if (savedtokenData) {
                        if (!backCompatible) {
                            cb(null, tokenData, userInst.id);
                        } else {
                            bcb(null, tokenData, userInst);
                        }
                    } else {
                        cb("error:AuthenticationError");
                    }
                });
            }
        });
    };

    this.getAccessToken = function(accessToken, scope, cb) {
        AuthService().getAccessToken(accessToken, function(tokenInst) {
            var _isValid = false,
                _isTokenValiReq;

            if (tokenInst) {
                /*getTokenUser1(tokenInst, function(userInst){
                console.log(userInst);
            });*/

                //TODO: TokenEntity.js checks for _isTokenValiReq value,
                //need to adjust the code as per further requirement
                _isTokenValiReq = {};
                if (scope) {
                    _isTokenValiReq.reqScope = scope;
                }
                _isValid = tokenInst.isTokenValid(_isTokenValiReq).isValid;

                cb(_isValid, tokenInst);
                return;
            }
            cb(_isValid);
            return;
        });
    };

    this.exchangeRefreshToken = function(refreshToken, clientId, cb) {
        AuthService().getRefreshToken(refreshToken, function(tokeninst) {
            var isvalid = false;
            var usercontext , accesstoken;
            isvalid = tokeninst ? (tokeninst.isRefreshTokenValid().isValid && tokeninst.getClientID() == clientId) : false;
            if(!isvalid)
                return cb('INVALID_REFRESH_TOKEN', 'INVALID_REFRESH_TOKEN');

            accesstoken = tokeninst.getToken();
            AuthService().deleteAccessToken(accesstoken, function(deleteerr) {
                if (deleteerr)
                    return cb('INTERNAL_ERROR', 'INTERNAL_ERROR');
                resettoken(tokeninst);
                AuthService().saveAccessToken(tokeninst, function(token) {
                    if(!token)
                        return cb('INTERNAL_ERROR', 'INTERNAL_ERROR');
                    cb(null , token , accesstoken);
                });
            });
        });
    };

    this.deleteAccessToken = function(accessToken, cb) {
        AuthService().deleteAccessToken(accessToken, function(Err) {
            if (Err) {

                cb(Err);
                return;
            }
            cb(null);
        });
    };

    this.removeUserToken = function(userId, cb) {
        AuthService().removeUserToken(userId, function(Err) {
            if (Err) {

                cb(Err);
                return;
            }
            cb(null);
        });
    };

    this.getTokenUser = function(tokenInst, cb) {

        var _userCtx = getUsrContext(tokenInst);

        UserService = require('../../api/services/UserService').getInst();
        UserService.setUserContext(_userCtx);

        UserService.on('found', function(_userInst) {
            cb(null, _userInst);
        });

        UserService.on('NoProfile', function() {
            cb('No User is associated in this session');
        });

        UserService.getUser(tokenInst.getResourceOwnerID());
    };
}


function getTokenContext(tokenInst) {
    var _userCtx = {
        clientId: tokenInst.getClientID(),
        tenantID: tokenInst.getTenantID(),
        datasource: tokenInst.getDatasource(),
        resourceOwnerID: tokenInst.getResourceOwnerID(),
        orgID: tokenInst.getOrgID(),
        clientID: tokenInst.getClientID(),
        scope: ['*']
    };
    return _userCtx;
}

function getUsrContext(tokenInst) {
    var _userCtx = {
        clientId: tokenInst.getClientID(),
        tenantId: tokenInst.getTenantID(),
        datasource: tokenInst.getDatasource(),
        userId: tokenInst.getResourceOwnerID(),
        orgId: tokenInst.getOrgID()
    };
    return _userCtx;
}

function regenerate(tokenobj){
    tokenobj = tokenobj || {};
    var accessTokenTTL = Number(config.auth.accessTokenTTL, 10) * 60000,
        refreshTokenTTL = Number(config.auth.refreshTokenTTL, 10) * 60000;
    tokenobj.accessToken = TokenService().generateToken("access");
    tokenobj.refreshToken = TokenService().generateToken("refresh") + accessTokenTTL; //TODO generate with some statndard
    tokenobj.token_type = 'bearer';
    tokenobj.expiresDate = new Date(new Date().getTime() + accessTokenTTL);
    tokenobj.refreshExpiresDate = new Date(new Date().getTime() + refreshTokenTTL);
    tokenobj.issuedDate = new Date();
    return tokenobj;
}

function updateTokenProps(tokenData) {
    regenerate(tokenData);
}

function resettoken(tokenInst){
    var d = regenerate();

    tokenInst.setToken(d.accessToken);
    tokenInst.setExpiry(d.expiresDate);
    tokenInst.setIssuedDate(d.issuedDate);
}
function prepareToken(req,userInst, clientId) {

    var generateID = require('../../utils/generateIds.js');
    var tokenData = {};
    var sessionId = generateID.SessionId(userInst._id);
    tokenData.identity = userInst.identity;
    tokenData.resourceOwnerID = userInst._id;
    tokenData.tenantID = userInst.accId;
    tokenData.datasource = userInst.datasource;
    tokenData.orgID = userInst.accountInfo.orgID;
    tokenData.clientID = clientId; //client.getClientID();
    //tokenData.scope = client.getScope();
    tokenData.sesId = sessionId;
    tokenData.devId = sessionId;
    tokenData.accountId = userInst.accountId;
    //TODO: validate and fix scope value
    //TODO: login says friends?
    //tokenData.scope = [scope];
    tokenData.scope = ['*'];
    tokenData.platDevType = req && req.headers['user-agent'];
    updateTokenProps(tokenData);
    return tokenData;
}

function sanitizeToken(tokenData) {
    if (!tokenData)
        return;
    delete tokenData.devId;
    delete tokenData.sesId;
    return tokenData;
}
module.exports = function() {
    if (!cache) {
        cache = new Oauth2Service();
    }
    return cache;
};