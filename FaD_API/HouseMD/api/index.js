/*
 * This file contains the list of services supported by client API
 */

var debug = require('debug')('APILoader');
var validator = require('./validator');
var apidocs = require('./apidocs');
var fs = require("fs");
var path = require('path');
var passport = require('passport');
var auth = require('../bootmodules/AuthServer/auth.js');

apidocs.addModels(validator.models);

function APILoader(app) {
    var
    //Imports

    // This variable acts as global scope for all Services of API to share objects
    // between services
        scope = {
            clientAPI: {}
        },

    //Array to hold list of API Endpoint Modules
        APIModules = [],
    //Perfix to URL Mappings
        APIURL_PREFIX = '/api',
        resourceEndpoints = require('./middleware/ResourceEndpoints'),
        methods = ['all', 'get', 'post', 'put', 'delete'];

    /**
     * This method loads mappings and applies to Express Server
     *
     * @param mappings : Object containing url mapping to service
     *                  Ex: {
     *                      '/User': {
     *                          get: function
     *                          post: function
     *                      }
     *                  }
     * @param route :
        *
     *
     */


    function loadMappings(resourcePath, mappings, route) {
        route = route || '';
        var key, urlMap,
            mapping;
        for (key in mappings) {
            if (mappings.hasOwnProperty(key)) {
                if (methods.indexOf(key) >= 0) {
                    urlMap = route;
                    if (APIURL_PREFIX) {
                        urlMap = APIURL_PREFIX + urlMap;
                    }
                    debug('mapping %s for %s', urlMap, key);
                    mapping = mappings[key];
                    switch (typeof mapping) {
                        case 'function':
                            app[key](urlMap, mapping);
                            break;
                        case 'object':
                            if (resourcePath) {
                                //get validator interceptor
                                var validator_fn = validator.getValidator(mapping);
                                //attach endpoint validator
                                mapping.callbacks.unshift(validator_fn);
                            }
                            mapping.callbacks.unshift(validator.validateQueryParams);
                            addAuthentication(app, key, urlMap, mapping ) 
                            apidocs.addApiMethod(resourcePath, route, key, mapping);
                            resourceEndpoints.add(key, urlMap, {
                                resource: mapping.resource,
                                action: mapping.action,
                                event: mapping.event,
                                category: mapping.category,
                                meta: mapping.meta,
                                audit: mapping.audit
                            });
                            break;
                    }

                } else {
                    loadMappings(resourcePath, mappings[key], route + key);
                }
            }
        }
    }

    function addAuthentication(app, key , urlMap, mapping ){

        // console.log(urlMap,'');signup
        if(urlMap.indexOf('/login') > -1 ){
            app[key](urlMap, passport.authenticate('local',{session: false}),auth.erroHandlingLogin,
            auth.serialize, auth.generateToken, auth.serializeClient, auth.generateRefreshToken, mapping.callbacks);
        }
        // else if(urlMap.indexOf('/signup') > -1){
        //     app[key](urlMap, mapping.callbacks, passport.authenticate('local',{session: false}),
        //     auth.serialize, auth.generateToken, auth.serializeClient, auth.generateRefreshToken, signUpresponseFunction);
        // }
        // // enables the otp for sign in 
        else if(urlMap.indexOf('/verifyOtpOnSignup') > -1){
            app[key](urlMap, mapping.callbacks, passport.authenticate('onSignUp',{session: false}),
            auth.serialize, auth.generateToken, auth.serializeClient, auth.generateRefreshToken, signUpresponseFunction);
        }
        else if( urlMap.indexOf('/validateToken') > -1){
            app[key](urlMap,auth.validateRefreshToken,auth.generateToken, mapping.callbacks);
        }else if( urlMap.indexOf('/verifyOtp') > -1){
            app[key](urlMap,mapping.callbacks,auth.generateToken, auth.responeObjectOnValidateToken);
        }else{
            // if(mapping.action === 'getDoctorById'){
            //     app[key](urlMap, mapping.callbacks);
            // }else{
            //     app[key](urlMap,auth.checkAuthentication, mapping.callbacks);
            // }
           app[key](urlMap, mapping.callbacks);
        }
        // 57ff3c597a48bca772bf6d92
    }


    function signUpresponseFunction (req, res, next) {
        var result = req.token;
        result.userId = req.user.userId;   
        res.send(result);
    }


    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        console.log
        if (req.isAuthenticated()){
            return next();
        }else{
            res.send("Used not logged In");
        }
    }
    function loadScopes(mappings, route) {
        route = route || '';
        var key, urlMap;
        for (key in mappings) {
            if (mappings.hasOwnProperty(key)) {
                //Logger.info('%s---------------%j' ,typeof mappings[key],mappings[key]);


                if (!Array.isArray(mappings[key])) {
                    loadScopes(mappings[key], route + key);
                    return;
                }


                urlMap = route;
                if (APIURL_PREFIX) {
                    urlMap = APIURL_PREFIX + urlMap;
                }
                //Logger.info('mapping %s for %s',urlMap, key);
                if (app.registerScope) {
                    //Logger.info('registerscope %s for %s',urlMap, key);
                    app.registerScope(key, urlMap, mappings[key]);
                }

            }
        }
    }


    /**
     * Loads REST Modules from FileSystem
     */
    function loadAPIModule(restMod) {
        if(restMod.file !== './rest/.DS_Store'){
            var restApi = require(restMod.file).getInst.call(scope);
            // console.log(restApi.getMappings)
            if (restApi && restApi.getMappings) {
                apidocs.addApiResource('/', restApi.resourcePath, restApi.description);
                loadMappings(restApi.resourcePath, restApi.getMappings());
            }
            if (restApi && restApi.getScopeConfig) {
                //Logger.info('\nLoading scopes' + restMod.name + ' from ' + restMod.file);
                debug('\nLoading scopes' + restMod.name + ' from ' + restMod.file);
                loadScopes(restApi.getScopeConfig());
            }
        }
    }

    fs.readdir(path.join(__dirname,'rest'),function(err, files){
        if(!err){
            files.forEach(function(fileName){
                var module = {};
                module.name = fileName.split('.')[0] + ' REST';
                module.file = './rest/' + fileName;
                // Add default rest at the beginning of array
                if(fileName === 'default.rest.js'){
                    APIModules.unshift(module);
                }else{
                    APIModules.push(module);
                }
            });
            APIModules.forEach(loadAPIModule);
        }else{
            console.log(err);
        }
    });

    Object.defineProperty(global, 'resourceEndpoints', {
        value: resourceEndpoints,
        writable: false,
        configurable: false
    });

    //load docs
    var apidocsEndpoint = '/apidocs';
    var apidocsMetaUrl = APIURL_PREFIX +'/api-docs';
    apidocs.configure(app, apidocsMetaUrl, apidocsEndpoint);
}

module.exports = {
    'load': APILoader
};
