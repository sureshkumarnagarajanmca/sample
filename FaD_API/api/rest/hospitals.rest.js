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
var HospitalService = require('../services/HospitalService');
var Q = require('q');



/**
 * This Class Implements REST API for HospitalAPI creation
 */
function HospitalAPI() {
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
        HospitalService.getById(id).then(function(data){

            if(data){

                 res.send(data);
            }else{
                res.status(404).json({
                    error: "Hospital not found"
                });
            }
        }).fail(function(err){
            res.send(err);
        });

    }

    function getList(req,res){
        HospitalService.getList().then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function getSearchedList(req,res){
        var data = req.query.searchText;
        var stateCode = req.query.stateCode;
        var cityName = req.query.city;
        HospitalService.getSearchedList(data,stateCode,cityName).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }



    function create(req, res) {

        var data = req.body;

       HospitalService.create(data).then(function(result){
               console.log("hospital result");
               console.log(result);
                res.send(result);
            })
            .fail(function(err){
                console.log(err);
                res.status(400).json({
                    error: "Hospital provider Id already exists"
                });
            });
    }

    function upload(req, res) {

        var data = req.body;
        HospitalService.upload(data).then(function(result){
                res.send(result);
        })
        .fail(function(err){
                res.send(err);
        });
    }

    function update(req, res) {
        var id = req.params.id;
        var data = req.body;

        HospitalService.update(id,data).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });

    }

    function getCitiesList(req,res){
        var stateCode = req.query.stateCode;
        HospitalService.getCitiesList(stateCode).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }



    this.resourcePath = '/hospital';
    this.description = "Operations about hospitals";
    this.getMappings = function() {
        return {

            '/hospital': {
                post : {
                    callbacks: [create],
                    resource: 'Hospital',
                    action: 'create',
                    summary: "Add new hospital",
                    notes: "This method inserts hospital to the hospital's list.",
                    type: "Taxonomy",
                    parameters: [
                        paramType.body("body","Provide json object to Create","hospital",true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/upload' :{
                    post : {
                        callbacks: [upload],
                        resource: 'Hospital',
                        action: 'upload',
                        summary: "Add new hospital",
                        notes: "This method helps to upload data. For batch operations purpose",
                        type: "Taxonomy",
                        parameters: [
                            paramType.body("body","Provide json object to Create","hospital",true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                },
                // get : {
                //     callbacks: [getList],
                //     resource: 'Hospital',
                //     action: 'getList',
                //     summary: "Get the list of hospital's",
                //     notes: "This method inserts hospital to the hospital's list.",
                //     responseMessages: [{
                //         "code": 400,
                //         "message": "Invalid parameters"
                //     }]
                // },
                // '/:searchText':{
                    get : {
                        callbacks: [getSearchedList],
                        resource: 'Hospital',
                        action: 'getSearchedList',
                        summary: "Get the list of hospital's",
                        notes: "This method inserts hospital to the hospital's list.",
                        parameters: [
                            paramType.query("searchText","search Text for hospital","string",true),
                            paramType.query("stateCode","search Text for hospital","string"),
                            paramType.query("city","search Text for hospital","string")
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },

     
                '/cities' : {
                    'get' : {
                        callbacks: [getCitiesList],
                        resource: 'Hospital',
                        action: 'getCitiesList',
                        summary: "Get hospital cities",
                        notes: "This method returns cities details",
                        parameters: [
                            paramType.query("stateCode","search Text for hospital","string")
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                // },
                '/:id':{
                    'put' : {
                        callbacks: [update],
                        resource: 'Hospital',
                        action: 'update',
                        summary: "updates the hospital by id",
                        notes: "This method accept the hospital provider Id and feilds to be updated in json format",
                        type: "Object",
                        parameters: [
                            // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("id", "hospital provider Id ", "string", true),
                            paramType.body("body","Provide json object to update","hospital",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getById],
                        resource: 'Hospital',
                        action: 'getById',
                        summary: "Get hospital details by provider Id",
                        notes: "This method returns speciality details",
                        parameters: [
                            paramType.path("id", "hospital provider Id", "string", true)
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
        return new HospitalAPI();
    }
};

