/**
 * Created by pradeep on 4/27/16.
 */

/**
 * Created by pradeep on 3/18/16.
 */

var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var LanguageService = require('../services/LanguageService');
var Q = require('q');



/**
 * This Class Implements REST API for HospitalAPI creation
 */
function LanguageAPI() {
    var clientAPI = this.clientAPI;

    function invokeResponse(req, res){

        function sendResponse(errCode, respMsg){
            if(!errCode){
                res.status(200);
                res.json(respMsg);
            }else{
                error = {
                    msg: respMsg,
                    code: errCode
                }
                errors =[error];
                resp = {};
                resp.errors = errors;
                res.status(errCode);
                res.setHeader('response-error-description' , JSON.stringify(resp));
                res.json(resp);
            }
        }
        return sendResponse;
    }

    function uploadLanguages(req, res) {
        var data = req.body;
        LanguageService.uploadLanguages(data).then(function(result){
            res.send(result);
        },function(err){
            res.send(err);
        });
    }

    function getLanguagesList(req, res){
        LanguageService.getLanguagesList().then(function(result){
            res.send(result);
        },function(err){
            res.send(err);
        });
    }

    this.resourcePath = '/language';
    this.description = "get All Languages";
    this.getMappings = function() {
        return {
            '/languages': {
                get : {
                    callbacks: [getLanguagesList],
                    resource: 'Languages',
                    action: 'getLanguagesList',
                    summary: "Get the list of Languages",
                    notes: "This fetches all languages.",
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/upload' :{
                    post : {
                        callbacks: [uploadLanguages],
                        resource: 'Languages',
                        action: 'uploadLanguages',
                        summary: "Add new Language",
                        notes: "This method helps to upload data. For batch operations purpose",
                        type: "Languages",
                        parameters: [
                            paramType.body("body","Provide json object to Create","language",true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                },
            }

        };
    };
}

module.exports = {
    getInst : function() {
        return new LanguageAPI();
    }
};

