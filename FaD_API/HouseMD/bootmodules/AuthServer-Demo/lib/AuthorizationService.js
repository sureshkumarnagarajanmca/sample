/*global _appConsts*/
/**
 *
 *
 * @Date:
 *
 *
 *	getAuthorizationCode ,saveAuthorizationCode({},cb) , saveAccessToken({},cb) , getAccessToken(context.accessToken, function(tokenData){});
 */
var cache = false,
    NODEUTIL = require('util'),
    ENTITYMANAGER = require(config.app.root + '/data/EntityManager.js').getInst(),
    NAME_SPACE = "SERVICE",
    ModelFactory = appGlobals.ModelFactory,
    Logger = console;

function AuthorizationService() {
    this.getAuthorizationCode = function(authcode, cb) {
    };

    this.getAccessToken = function(accesstoken, cb) {
        var self = this,
            tokenInst, authorizationModel;

        authorizationModel = ModelFactory.getAuthorizationModel();

        authorizationModel.fetchByAccesstoken(accesstoken, function(resObj) {
            if (resObj.error) {
                Logger.error("Authorization Service : getAccessToken - response %s", resObj.error);
                cb(null);
                return;
            }

            tokenInst = resObj.tokenInst;

            cb(tokenInst);
        });
    };

    this.getRefreshToken = function(refreshToken, cb) {
        var self = this,
            tokenInst, authorizationModel;

        authorizationModel = ModelFactory.getAuthorizationModel();

        authorizationModel.fetchByRefreshtoken(refreshToken, function(resObj) {
            if (resObj.error) {
                Logger.error("Authorization Service : getAccessToken - response %s", resObj.error);
                cb(null);
                return;
            }

            tokenInst = resObj.tokenInst;

            cb(tokenInst);
        });
    };

    this.saveAuthorizationCode = function(authCodeObj, cb) {
    };

    this.saveAccessToken = function(accesstokenObj, cb) {
        var self, userInfo, tokenInst, authorizationModel;

        self = this;

        authorizationModel = ModelFactory.getAuthorizationModel();

        if (!accesstokenObj) {
            cb(null);
            return;
        }
        if(!(accesstokenObj instanceof ENTITYMANAGER.getEntity('token'))){
            tokenInst = ENTITYMANAGER.getEntityInst('token');
            tokenInst.load(NAME_SPACE, accesstokenObj);
        }
        else
            tokenInst = accesstokenObj;

        authorizationModel.saveAccesstoken(tokenInst, function(resObj) {
            var _tokenInst;

            if (resObj.error) {
                cb(null);
                return;
            }
            _tokenInst = resObj.tokenInst;

          cb(_tokenInst.serialize(NAME_SPACE));
        });
    };

    this.deleteAccessToken = function(accessTokenValue , callBack){
        var self , authorizationModel;

        self = this;

        authorizationModel = ModelFactory.getAuthorizationModel();

        if (!accessTokenValue) {
            callBack('Invalid Token');
            return;
        }
        var ksId;
        authorizationModel.getAcessToken(accessTokenValue, function(err, token) {
            if (token) {
                ksId = token.ksId;
            }
            authorizationModel.deleteAccessToken(accessTokenValue, function(deleteErr) {
                var _tokenInst;

                if (deleteErr) {
                    cb('AccessTokenDeleteError');
                    return;
                }
                if (ksId) {
                    var notificationService = require('../../../services/NotificationService').getInst()
                    notificationService.unsubscribe(token.sesId, ksId);
                }
                callBack(null);
            });
        });
    };

    this.removeUserToken = function(userId , callBack){
        var self , authorizationModel;

        self = this;

        authorizationModel = ModelFactory.getAuthorizationModel();

        if (!userId) {
            callBack('Invalid userId');
            return;
        }

        authorizationModel.removeUserToken(userId, function(deleteErr) {
            var _tokenInst;

            if (deleteErr) {
                cb('AccessTokenDeleteError');
                return;
            }
            callBack(null);
        });
    };

    this.sanitizeaccesstoken = function(tokendata){
        var tokeninst;
        tokeninst = ENTITYMANAGER.getEntityInst('token');
        tokeninst.load(NAME_SPACE ,  tokendata);
        return tokeninst.serialize(NAME_SPACE);
    }
}

module.exports = function() {
    if (!cache) {
        cache = new AuthorizationService();
    }
    return cache;

};
