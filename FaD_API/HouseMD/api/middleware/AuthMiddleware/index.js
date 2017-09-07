/*global _appConsts, SecurityLogger, resourceEndpoints*/

/**
 * @module AuthMiddleware
 *
 */
var config      = require('../../../config');
var userContextModule = require(config.app.root + "/api/services/UserContextService.js");
//var teamRolesModule = require(config.app.root + "/api/services/TeamsService/TeamRoles");
//var teamsModule = require(config.app.root + "/api/services/TeamsService");
var RestAPIBase = require(config.app.root + "/api/lib/RestAPIBase");
var apiBase = new RestAPIBase();

function AuthMiddleware(options) {
    var _options, _excludePaths, _no_of_uris, _authService, _authServiceInst,
        _reportRequest, _modelFactory, _roleService;

    _reportRequest = options.reports;
    _modelFactory = appGlobals.ModelFactory;
    _authService = require(config.app.root + '/api/services/AuthenticationService');
    _roleService = require(config.app.root + '/api/services/Administration/RolesService').getInst();
    //_authServiceInst = _authService.getInst();
    _excludePaths = (options && options.excludePaths && options.excludePaths.length !== 0) ? options.excludePaths : undefined;
    _no_of_uris = (_excludePaths) ? _excludePaths.length : 0;

    function isExcluded(uri) {
        var _ii, _loop_uri;
        if (!_excludePaths) {
            return false;
        }
        if (!Array.isArray(_excludePaths)) {
            if (uri.indexOf(_excludePaths) !== -1) {
                return true;
            }
        }
        _ii = _no_of_uris;
        while (_ii) {
            _ii -= 1;
            _loop_uri = _excludePaths[_ii];
            if (uri.indexOf(_loop_uri) !== -1) {
                return true;
            }
        }
        return false;
    }

    function setUserRoles(userContext,cb) { //Backward compatibility for services using userContext.roles
        if(userContext.userRoles && userContext.userRoles.indexOf('admin') !== -1 ){
            userContext.roles = [{role:'admin'}];
        }
        cb();
       /*var _roleUsersModelInst, roleJson;
        var _dsObj = {
            getDatasource: function() {
                return userContext.datasource
            }
        }
        _roleService.setUserContext(userContext);
        _roleService.getRolesOfUsers(userContext.orgId, [userContext.userId], function(status, role) {
            if (role && role[0]) {
                roleJson = role[0].toJSON()
                userContext.roles = [roleJson]
            } else {
                _roleService.getRoleByRoleName(userContext.orgId, "user", function(err, roleDet) {
                    //roleDet = roleDet[0].toJSON();
                    //_userCtx.roles = [roleDet];
                });
            }
            cb();

        });*/
    }

    function prepareUserContext(_userCtx,appCtrls){
        var licenseIds = [];
        if(appCtrls && Array.isArray(appCtrls.licenses)){
            appCtrls.licenses.forEach(function(license){
                licenseIds.push(license.id);
            });
        }
        _userCtx.licenses = appCtrls.licenses;
        _userCtx.licenseIds = licenseIds;
        _userCtx.groups = appCtrls.groups;
        _userCtx.permissions = appCtrls.permissions;
        _userCtx.userRoles = appCtrls.roles;
        _userCtx.usage = appCtrls.usage;
        _userCtx.defaultOrgId = appCtrls.defaultOrgId;
        _userCtx.defaultOrgName = appCtrls.defaultOrgName;
    }

    function addTeamRoles(userContext,teamRoles){
        userContext.team = {};
        if(teamRoles && teamRoles.roles && teamRoles.roles.length > 0){
            teamRoles.roles.forEach(function(teamRole){
                if(teamRole.users.indexOf(userContext.userId) !== -1){
                    userContext.team.permissions = teamRole.permissions;
                    userContext.team.role = teamRole.role;
                }
            });
        }
    }

    return function(req, res, next) {
        var _userCtx;
        if (isExcluded(req.uri)) {
            next();
            return;
        }
        var authValidity = {
            isValid: req.isAuthenticated
        };
        var token = req.tokenInfo;

        var log, endpoint, drOptions = {}, errors, error, resp;
        endpoint = resourceEndpoints.match(req);

        log = {
            req: req
        };
        if (endpoint) {
            req.staticPath = endpoint.path;
            log.resource = req.resource = endpoint.options.resource;
            log.action = req.action = endpoint.options.action;
        }
        if (authValidity && authValidity.isValid === true) {
            _userCtx = {
                identity: token.getIdentity(),
                userAgent: req.headers['user-agent'],
                isoCountryCode: req.headers['x-country-code'] || req.headers['X-Country-Code'],
                clientId: token.getClientID(),
                tenantId: token.getTenantID(),
                datasource: token.getDatasource(),
                userId: token.getResourceOwnerID(),
                orgId: token.getOrgID(),
                ksId: token.getKsId(),
                sesId: token.getSesId(),
                accountId : token.getAccountID(),
                storageContext: config.storage.fileStores.s3.storageContext
            };
            var userContextService = userContextModule.getInst(_userCtx);
            var teamRolesService = teamRolesModule.getInst();
            teamRolesService.setUserContext(_userCtx);

            var teamsService = teamsModule.getInst();
            teamsService.setUserContext(_userCtx);

            userContextService.getUserContextById(_userCtx.userId,function(err,result){
                if(err){
                    AppLogger.error(err);
                    return next(err);
                }
                prepareUserContext(_userCtx,result);
                req.userContext = _userCtx;
                req.userId = _userCtx.userId;
                req.orgId = _userCtx.orgId;
                log.userContext = _userCtx;
                if(endpoint && endpoint.params && endpoint.params.teamId){
                    var teamId = endpoint.params.teamId;
                    teamRolesService.getTeamRolesContext(teamId,function(err,teamRoles){
                        addTeamRoles(req.userContext,teamRoles);
                        req.userContext.team.teamId = teamId;

                        //Update - Added team user status in user context -- @AA@ 12-Nov-2014
                        teamsService.getMemberStatus(teamId, req.userId, function(err, result) {
                            if(err) {
                                err = new config.errors.Forbidden();
                                return apiBase.reply(err, req, res);
                            }
                            req.userContext.team.memberStatus = result.status;
                            req.userContext.team.isActiveMember = result.isActiveMember;
                            req.userContext.team.orgId = result.teamOrgId;
                            req.userContext.team.settings = result.teamSettings;
                            setUserRoles(_userCtx,function(){
                                next();
                            });
                        })

                    });
                }
                else{
                    setUserRoles(_userCtx,function(){
                        next();
                    });
                }
            });
            return;
        }
        SecurityLogger.error("Authorization failed", log);

        error = {
            msg: authValidity.errorCode,
            code: 4001
        }
        errors = [error];
        resp = {};
        resp.errors = errors;
        res.status(401);
        res.setHeader('response-error-description', JSON.stringify(resp));
        res.json(resp);
    };
}

module.exports = AuthMiddleware;
