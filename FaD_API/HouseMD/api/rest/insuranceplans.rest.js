/**
 * Created by pradeep on 3/18/16.
 */
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var InsurancePlanService = require('../services/InsurancePlanService');

var security = require('../../utils/crypto');

var Q = require('q');



/**
 * This Class Implements REST API for Insurance Plans  creation
 */
function InsurancePlansAPI() {
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

    function getById(req,res){
        var id = req.params.id;
        InsurancePlanService.getById(id).then(function(data){
                res.send(data);
            })
            .fail(function(err){
                res.send(err);
            });

    }

    function getByProviderId(req,res){
        var id = req.params.id;
        InsurancePlanService.getByProviderId(id).then(function(data){
                res.send(data);
            })
            .fail(function(err){
                res.send(err);
            });

    }

    function getList(req,res){

        InsurancePlanService.getList().then(function(data){
                res.send(data);
            })
            .fail(function(err){
                res.send(err);
            });

    }



    function create(req, res) {

        var data = req.body;

        InsurancePlanService.create(data).then(function(result){
                res.send(result);
            })
            .fail(function(err){
                res.send(err);
            });
    }

    function update(req, res) {
        var id = req.params.id;
        var data = req.body;

        InsurancePlanService.update(id,data).then(function(result){
                res.send(result);
            })
            .fail(function(err){
                res.send(err);
            });

    }

    this.resourcePath = '/insuranceplans';
    this.description = "Operations about Insurance Plans";
    this.getMappings = function() {
        return {

            '/insuranceplans': {
                post : {
                    callbacks: [create],
                    resource: 'InsurancePlan',
                    action: 'create',
                    summary: "Add new InsurancePlan",
                    notes: "This method inserts InsurancePlan to the InsurancePlan's list.",
                    type: "InsuranceProvider",
                    parameters: [
                        paramType.body("body","Provide json object to Create","insuranceplan",true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                get : {
                    callbacks: [getList],
                    resource: 'InsurancePlan',
                    action: 'getList',
                    summary: "Get the list of InsurancePlan's",
                    notes: "This method inserts InsurancePlan to the InsurancePlan's list.",
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },

                '/:id':{
                    'put' : {
                        callbacks: [update],
                        resource: 'InsurancePlan',
                        action: 'update',
                        summary: "updates the InsuranceProvider by id",
                        notes: "This method accept the InsuranceProvider Id and feilds to be updated in json format",
                        type: "Object",
                        parameters: [
                            // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("id", "InsurancePlan id ", "string", true),
                            paramType.body("body","Provide json object to update","insuranceplan",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getById],
                        resource: 'InsurancePlan',
                        action: 'getById',
                        summary: "Get InsurancePlan details by Id",
                        notes: "This method returns InsuranceProvider details",
                        parameters: [
                            paramType.path("id", "InsurancePlan Id", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                '/provider/:id':{

                    'get' : {
                        callbacks: [getByProviderId],
                        resource: 'InsurancePlan',
                        action: 'getByProviderId',
                        summary: "Get InsurancePlan details by Id",
                        notes: "This method returns InsuranceProvider details",
                        parameters: [
                            paramType.path("id", "InsuranceProvider Id", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                }


            }

        };
    };
}

module.exports = {
    getInst : function() {
        return new InsurancePlansAPI();
    }
};