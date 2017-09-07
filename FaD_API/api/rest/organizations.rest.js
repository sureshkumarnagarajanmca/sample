


/**
 * Created by pradeep on 3/6/16.
 */
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var OrganizationService = require('../services/OrganizationService');

var security = require('../../utils/crypto');

var Q = require('q');



/**
 * This Class Implements REST API for Organization creation
 */
function OrganizationsAPI() {
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

    function getOrganizationById(req,res){
        var id = req.params.organizationId;
        OrganizationService.getOrganizationById(id).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function getOrganizationByQuery(req,res){
        var query = {};

        if(req.query){
            var key     = req.query.key;
            var value   = req.query.value;

            query[key] = value;

            OrganizationService.getOrganizationByQuery(query).then(function(data){
                    res.send(data);
            })
            .fail(function(err){
                    res.send(err);
            });
        }
    }

    function getOrganizationByNpi(req,res){
        var id = req.params.npiId;
        OrganizationService.getOrganizationByNpi(id).then(function(data){
            if(data.errorMessage){
                res.status(404).send(data);
            }else{
                res.send(data);
            }
        })
        .fail(function(err){
            res.status(500).send(err);
        });
    }

    function upload(req, res) {
        var data = req.body;
        OrganizationService.upload(data).then(function(result){
                res.send(result);
        })
        .fail(function(err){
                res.send(err);
        });
    }

    function getSearchedListByName(req,res){
        var data = req.query.searchText;
        OrganizationService.getSearchedList(data).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }



    function getSearchedListByNameAndZip(req,res){
        var data = req.query.searchText;
        var zipCode = req.query.zipCode;
        var stateCode =  req.query.stateCode;
        var city  = req.query.city;
     
        OrganizationService.getSearchedListOnNameAndZipCode(data,zipCode,stateCode,city).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }
    function getCitiesList(req,res){
          var stateCode = req.query.stateCode;
          OrganizationService.getCitiesList(stateCode).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }
    function getStatesList(req,res){
          OrganizationService.getStatesList().then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function createOrganization(req, res) {

        var data = req.body;
        console.log(data);

        OrganizationService.createOrganization(data).then(function(result){
                res.send(result);
        })
        .fail(function(err){
                res.send(err);
        });
    }

    function updategetOrganization(req, res) {
        var id = req.params.doctorId;
        var data = req.body;

        OrganizationService.updateOrganization(id,data).then(function(result){
                res.send(result);
        })
        .fail(function(err){
                res.send(err);
        });
    }

    this.resourcePath = '/organizations';
    this.description = "Operations about organizations";
    this.getMappings = function() {
            return {
                '/organization': {
                     '/upload' :{
                        post : {
                            callbacks: [upload],
                            resource: 'Organization',
                            action: 'upload',
                            summary: "Add new Organization",
                            notes: "This method helps to upload data. For batch operations purpose",
                            type: "Organization",
                            parameters: [
                                paramType.body("body","Provide json object to Create","organization",true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                    },
                    get : {
                        callbacks: [getSearchedListByNameAndZip],
                        resource: 'Organization',
                        action: 'getSearchedList',
                        summary: "Get the list of Organization's",
                        notes: "This method searches for  organization's",
                        parameters: [
                            paramType.query("searchText","search Text for organization","string",true),
                            paramType.query("zipCode","Enter zipCode of Organization","string"),
                            paramType.query("stateCode","Enter state code  of Organization","string"),
                            paramType.query("city","Enter city of Organization","string")  
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    post : {
                        callbacks: [createOrganization],
                        resource: 'Organization',
                        action: 'createOrganization',
                        summary: "create new organization",
                        notes: "This method creates new organization.",
                        type: "Object",
                        parameters: [
                            paramType.body("body","Provide json object to Create","organizationCreate",true),
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    '/states' : {
                        'get' :{
                            callbacks: [getStatesList],
                            resource: 'Organization',
                            action: 'getStatesList',
                            summary: "getStatesList",
                            notes: "This method returns list of  states having organisation organizations  ",
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        }

                   },
                     '/cities' : {
                        'get' :{
                            callbacks: [getCitiesList],
                            resource: 'Organization',
                            action: 'getCitiesList',
                            summary: "getCitiesList",
                            notes: "This method returns list of  states having organisation organizations  ",
                            parameters: [
                            paramType.query("stateCode","search Text for organization","string",true)

                        ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]

                        }

                   }


                   ,
                    '/query':{
                        'get' :{
                            callbacks: [getOrganizationByQuery],
                            resource: 'Organization',
                            action: 'getOrganizationByQuery',
                            summary: "getOrganizationByQuery",
                            notes: "This method returns list of organizations by query ex: key = 'firstName' and value = 'MARSHFIELD CLINIC'",
                            parameters: [
                                paramType.query("key", "Enter 'key' field like firstName or phoneNo..etc ", "string", true),
                                paramType.query("value", "Enter 'value' of the key like 'MARSHFIELD CLINIC' ", "string", true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        }
                    },
                    '/:organizationId':{
                        'put' : {
                            callbacks: [updategetOrganization],
                            resource: 'Organization',
                            action: 'updategetOrganization',
                            summary: "updates the organization by id",
                            notes: "This method accept the organizationId and feilds to be updated",
                            type: "Object",
                            parameters: [
                                // paramType.header("authorization", "access token to", "string", false),
                                paramType.path("organizationId", "Organization Id of the FAD Application", "string", true),
                                paramType.body("body","Provide json object to update","organization",true),

                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                        'get' : {
                            callbacks: [getOrganizationById],
                            resource: 'Organization',
                            action: 'getOrganizationById',
                            summary: "Get Organization details by Id",
                            notes: "This method returns Organization details",
                            parameters: [
                                paramType.path("organizationId", "Organization Id", "string", true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        }
                    },
                    '/npi/:npiId':{
                        'get' : {
                            callbacks: [getOrganizationByNpi],
                            resource: 'Organization',
                            action: 'getOrganizationByNpi',
                            summary: "Get Organization details by Npi Id",
                            notes: "This method returns Organization details",
                            parameters: [
                                paramType.path("npiId", "please enter organization npi Id", "string", true)
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
        return new OrganizationsAPI();
    }
};
