/**
 * Created by pradeep on 4/27/16.
 */

/**
 * Created by narasimha on 4/03/2017.
 */

var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var MedicalSchoolService = require('../services/MedicalSchoolService.js');
var Q = require('q');

console.log()

/**
 * This Class Implements REST API for MedicalSchoolAPI creation
 */
function MedicalSchoolAPI() {
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
         MedicalSchoolService.getById(id).then(function(data){

            if(data){

                 res.send(data);
            }else{
                res.status(404).json({
                    error: "Medical School  not found"
                });
            }
        }).fail(function(err){
            res.send(err);
        });

    }

    function getList(req,res){
        MedicalSchoolService.getList().then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function getSearchedList(req,res){
        var data = req.query.searchText;
        var stateCode = req.query.state;
        var cityName = req.query.city;
        var country  = req.query.country;
     //country,state, city
        MedicalSchoolService.getSearchedList(data,country,stateCode,cityName).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }



    function create(req, res) {

        var data = req.body;

        MedicalSchoolService.create(data).then(function(result){
                res.send(result);
            })
            .fail(function(err){
                res.status(400).json({
                    error: " Medical school  already exists"
                });
            });
    }

    function upload(req, res) {

        var data = req.body;
        MedicalSchoolService.upload(data).then(function(result){
                res.send(result);
        })
        .fail(function(err){
                res.send(err);
        });
    }

    function update(req, res) {
        var id = req.params.id;
        var data = req.body;

        MedicalSchoolService.update(id,data).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });

    }

    function getCitiesList(req,res){
        var state = req.query.state;
        var country = req.query.country;
        MedicalSchoolService.getCitiesList(country,state).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }
    
    function getStatesList(req,res){
        var country = req.query.country;
        MedicalSchoolService.getStatesList(country).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }


    this.resourcePath = '/medicalSchool';
    this.description = "Operations about hospitals";
    this.getMappings = function() {
        return {

            '/medicalSchool': {
                post : {
                    callbacks: [create],
                    resource: 'MedicalSchool',
                    action: 'create',
                    summary: "Add new medicalSchool",
                    notes: "This method inserts medicalSchool to the medicalSchool's list.",
                    type: "Taxonomy",
                    parameters: [
                        paramType.body("body","Provide json object to Create","medicalSchool",true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/upload' :{
                    post : {
                        callbacks: [upload],
                        resource: 'MedicalSchool',
                        action: 'upload',
                        summary: "Add new medicalSchool",
                        notes: "This method helps to upload data. For batch operations purpose",
                        type: "Taxonomy",
                        parameters: [
                            paramType.body("body","Provide json object to Create","medicalSchool",true)
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
                        resource: 'MedicalSchool',
                        action: 'getSearchedList',
                        summary: "Get the list of hospital's",
                        notes: "This method inserts hospital to the hospital's list.",
                        parameters: [
                            paramType.query("searchText","search Text for medicalSchool","string",true),
                             paramType.query("country","search Text for medicalSchool","string"),
                            paramType.query("state","search Text for medicalSchool","string"),
                            paramType.query("city","search Text for medicalSchool","string")
                          

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                   '/states'  : {
                      get : {
                          callbacks: [getStatesList],
                          resource: 'medicalSchool',
                          action: 'getStatesList',
                          summary: "Get states having mecical school in that country",
                          notes: "This method returns cities details",
                          parameters: [
                             paramType.query("country","search Text for medicalSchool","string")
                            ],
                          responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                          }]
                     }

                },
                   
                '/cities' : {
                    'get' : {
                        callbacks: [getCitiesList],
                        resource: 'medicalSchool',
                        action: 'getCitiesList',
                        summary: "Get medicalSchool cities",
                        notes: "This method returns cities details",
                        parameters: [
                              paramType.query("country","search Text for medicalSchool","string"),
                              paramType.query("state","search Text for medicalSchool","string"),
                        
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
                        resource: 'MedicalSchool',
                        action: 'update',
                        summary: "updates the hospital by id",
                        notes: "This method accept the medical school id and feilds to be updated in json format",
                        type: "Object",
                        parameters: [
                            // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("id", "medicalSchool Id ", "string", true),
                            paramType.body("body","Provide json object to update","medicalSchool",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getById],
                        resource: 'MedicalSchool',
                        action: 'getById',
                        summary: "Get medicalSchool details by medicalSchool Id",
                        notes: "This method returns speciality details",
                        parameters: [
                            paramType.path("id", "medicalSchool Id", "string", true)
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

        return new MedicalSchoolAPI();
    }
};

