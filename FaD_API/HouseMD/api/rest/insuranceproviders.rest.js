/**
 * Created by pradeep on 3/17/16.
 */
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');

var InsuranceProviderService = require('../services/InsuranceProviderService');
var InsurancePlanService = require('../services/InsurancePlanService');

var Q = require('q');



/**
 * This Class Implements REST API for InsuranceProvidersAPI creation
 */
function InsuranceProviderAPI() {
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
        InsuranceProviderService.getById(id).then(function(data){
                res.send(data);
            })
            .fail(function(err){
                res.send(err);
            });

    }



    function getList(req,res){
        var id = req.params.id;
        var promisesArray = [];
        promisesArray.push(InsuranceProviderService.getPopularInsuranceList())
        promisesArray.push(InsuranceProviderService.getRegularInsuranceList())
        Q.all(promisesArray).then(function(insurances){
            console.log(insurances)
            res.send({
                popular : insurances[0],
                regular : insurances[1]
            });
        },function(fail){
            errorFunctions.sendInternalServerError(req,res,fail);
        })

    }

    function getListNodivision(req,res){
        var id = req.params.id;
        var promisesArray = [];
        promisesArray.push(InsuranceProviderService.getPopularInsuranceList())
        promisesArray.push(InsuranceProviderService.getRegularInsuranceList())
        Q.all(promisesArray).then(function(insurances){
            // console.log(insurances[0],insurances[1])
            var result = [];
            result.push.apply(result,insurances[0]);
            result.push.apply(result,insurances[1]);            
            // res.send({
            //     popular : insurances[0],
            //     regular : insurances[1]
            // });
        res.send(result)
        },function(fail){
            errorFunctions.sendInternalServerError(req,res,fail);
        })

    }



    function addInsurance(req, res) {
        var data = req.body;
        InsuranceProviderService.addInsurance(data).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function update(req, res) {
        var id = req.params.id;
        var data = req.body;
        InsuranceProviderService.update(id,data).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });

    }

    function getProiderPlansList(req,res){
        var id = req.params.id;
        var data = req.body;
        // console.log(id);
        InsurancePlanService.getByProviderId(id).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    this.resourcePath = '/insuranceproviders';
    this.description = "Operations about Insurance Provider";
    this.getMappings = function() {
        return {

            '/insuranceproviders': {
                post : {
                    callbacks: [addInsurance],
                    resource: 'InsuranceProvider',
                    action: 'addInsurance',
                    summary: "Add new InsuranceProvider",
                    notes: "This method inserts InsuranceProvider to the InsuranceProvider's list.",
                    type: "addInsurance",
                    parameters: [
                        paramType.body("body","Provide json object to Create","addInsurance",true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                get : {
                    callbacks: [getList],
                    resource: 'InsuranceProvider',
                    action: 'getList',
                    summary: "Get the list of InsuranceProvider's",
                    notes: "This method inserts InsuranceProvider to the InsuranceProvider's list.",
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/getListNodivision':{
                    'get' : {
                        callbacks: [getListNodivision],
                        resource: 'InsuranceProvider',
                        action: 'getListNodivision',
                        summary: "Get InsuranceProvider details without division",
                        notes: "This method returns InsuranceProvider details without diision",
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                '/:id':{
                    'put' : {
                        callbacks: [update],
                        resource: 'InsuranceProvider',
                        action: 'update',
                        summary: "updates the InsuranceProvider by id",
                        notes: "This method accept the InsuranceProvider Id and feilds to be updated in json format",
                        type: "Object",
                        parameters: [
                            // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("id", "InsuranceProvider id ", "string", true),
                            paramType.body("body","Provide json object to update","insuranceprovider",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getById],
                        resource: 'InsuranceProvider',
                        action: 'getById',
                        summary: "Get InsuranceProvider details by Id",
                        notes: "This method returns InsuranceProvider details",
                        parameters: [
                            paramType.path("id", "InsuranceProvider Id", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    '/plans' :{
                        'get' :{
                            callbacks: [getProiderPlansList],
                            resource: 'InsuranceProvider',
                            action: 'getProiderPlansList',
                            summary: "Get InsuranceProvider plans details based on id",
                            notes: "This method returns InsuranceProvider plans list",
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

            }

        };
    };
}

module.exports = {
    getInst : function() {
        return new InsuranceProviderAPI();
    }
};