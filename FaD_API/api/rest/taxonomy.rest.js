/**
 * Created by pradeep on 3/18/16.
 */

var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var TaxonomyService = require('../services/TaxonomyService');

var security = require('../../utils/crypto');

var errorFunctions = require('../errorCodeFunctions');

var Q = require('q');




/**
 * This Class Implements REST API for InsuranceProvidersAPI creation
 */
function TaxonomyAPI() {

    'use strict'
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
        /*
        * This service checks the given id has parent or not. If it has a parent it will get
        *  the all sub items belongs to given id 
        *  Ex: If the given id is level 1 or 2 it fetch all the sub items maped to the given id.
        */

        var id = req.params.id;
        TaxonomyService.getById(id).then(function(data){

           if(data){
               var taxonomy  = {};
               taxonomy  = data.toObject();
                    TaxonomyService.getByParentId(taxonomy._id).then(function(data){
                       if(taxonomy.level == 1){
                           taxonomy.specialities = [];
                           taxonomy.specialities = data;
                       }else if(taxonomy.level == 2){
                           taxonomy.subSpecialities = [];
                           taxonomy.subSpecialities = data;
                       }else{
                           taxonomy.reasons = [];
                           taxonomy.reasons = data;
                       }
                       res.send(taxonomy);
                   }).fail(function(err){
                       res.send(err);
                   });


           }else{
              res.status(404).json({
                   error: "Speciality not found"
              });
           }
        }).fail(function(err){
                res.send(err);
        });

    }

    

    function getList(req,res){
        var id = req.params.id;
        TaxonomyService.getList(id).then(function(data){
                res.send(data);
            })
            .fail(function(err){
                res.send(err);
            });

    }
    function getByLevel(req,res){
        var level = req.params.no;
        TaxonomyService.getByLevel(level).then(function(data){
            res.send(data);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function getTaxonomyByIdAndParentNoDivision (req,res) {
        var parentCode = req.query.parentCode;
        // if(!!parentCode){
            var level = parseInt(req.params.no);
            if(level === 3){
                TaxonomyService.getSubSpecilitiesByParentId(parentCode).then(function(data){
                    if(data.length > 0){
                        res.send(data);
                    }else{
                        res.send(data);
                    }
                },function(err){
                    // res.send("Error getting Taxonomy")
                });
            }else if(level === 2){
                // getPopularSpecilitiesgetByParentId
                // getGeneralSpecilitiesgetByParentId
                var promisesArray = [];
                promisesArray.push(TaxonomyService.getPopularSpecilitiesgetByParentId(parentCode,2))
                promisesArray.push(TaxonomyService.getGeneralSpecilitiesgetByParentId(parentCode,2))
                Q.all(promisesArray).then(function(Taxonomies){
                    console.log(Taxonomies)
                    // if(data.length > 0){
                    //     res.send(data);
                    // }else{
                    //     res.send(data);
                    
                    // }

                    var result = [];
                    result.push.apply(result,Taxonomies[0]);
                    result.push.apply(result,Taxonomies[1]);
                    // res.send({
                    //     popular: Taxonomies[0],
                    //     regular : Taxonomies[1]
                    // })
                    res.send(result);
                },function(err){
                    // res.send("Error getting Taxonomy")
                    errorFunctions.sendInternalServerError(req,res,err);
                });
            }else if(level == 1){
                getByLevel(req,res);
            }else{
                TaxonomyService.getByParentId(parentCode).then(function(data){
                    if(data.length > 0){
                        if(level == 4){
                            var levelParentArray = [parentCode];
                            // var levelParentArray = [];
                            var responseObj= [];
                            for (var i = 0; i < data.length; i++) {
                                levelParentArray.push(data[i]._id)
                            };
                            console.log(levelParentArray);

                            var promisesArray = [];
                            promisesArray.push(TaxonomyService.getPopularReasonBasedOnParentArray(levelParentArray))
                            promisesArray.push(TaxonomyService.getRegularReasonBasedOnParentArray(levelParentArray))
                            Q.all(promisesArray).then(function(Reasons){
                               var result = [];
                                result.push.apply(result,Reasons[0]);
                                result.push.apply(result,Reasons[1]);
                                res.send(result);
                            },function(fail){
                                errorFunctions.sendInternalServerError(req,res,fail);
                            })
                        }else{
                            res.send(data);
                        }
                    }else{
                        res.send(data);
                        // res.send("No specialities Found")
                    }
                },function(err){
                    errorFunctions.sendInternalServerError(req,res,err);
                });
            }
    }

    function getTaxonomyByIdAndParent(req, res){
        var parentCode = req.query.parentCode;
        // if(!!parentCode){
            var level = parseInt(req.params.no);
            if(level === 3){
                TaxonomyService.getSubSpecilitiesByParentId(parentCode).then(function(data){
                    if(data.length > 0){
                        res.send(data);
                    }else{
                        res.send(data);
                    }
                },function(err){
                    // res.send("Error getting Taxonomy")
                });
            }else if(level === 2){
                // getPopularSpecilitiesgetByParentId
                // getGeneralSpecilitiesgetByParentId
                var promisesArray = [];
                promisesArray.push(TaxonomyService.getPopularSpecilitiesgetByParentId(parentCode,2))
                promisesArray.push(TaxonomyService.getGeneralSpecilitiesgetByParentId(parentCode,2))
                Q.all(promisesArray).then(function(Taxonomies){
                    console.log(Taxonomies)
                    // if(data.length > 0){
                    //     res.send(data);
                    // }else{
                    //     res.send(data);
                    // }
                    res.send({
                        popular: Taxonomies[0],
                        regular : Taxonomies[1]
                    })
                },function(err){
                    // res.send("Error getting Taxonomy")
                    errorFunctions.sendInternalServerError(req,res,err);
                });
            }else if(level == 1){
                getByLevel(req,res);
            }else{

                TaxonomyService.getByParentId(parentCode).then(function(data){
                    if(data.length > 0){
                        if(level == 4){
                            var levelParentArray = [parentCode];
                            // var levelParentArray = [];
                            var responseObj= [];
                            for (var i = 0; i < data.length; i++) {
                                levelParentArray.push(data[i]._id)
                            };
                            console.log(levelParentArray);

                            var promisesArray = [];
                            promisesArray.push(TaxonomyService.getPopularReasonBasedOnParentArray(levelParentArray))
                            promisesArray.push(TaxonomyService.getRegularReasonBasedOnParentArray(levelParentArray))
                            Q.all(promisesArray).then(function(Reasons){
                                res.send({
                                    popular : Reasons[0],
                                    regular : Reasons[1]
                                });
                            },function(fail){
                                errorFunctions.sendInternalServerError(req,res,fail);
                            })
                        }else{
                            res.send(data);
                        }
                    }else{
                        res.send(data);
                        // res.send("No specialities Found")
                    }
                },function(err){
                    errorFunctions.sendInternalServerError(req,res,err);
                });
            }
        // }else{
        //     getByLevel(req,res)
        // }
    }

    function create(req, res) {

        var data = req.body;

        TaxonomyService.create(data).then(function(result){
                res.send(result);
            })
            .fail(function(err){
                res.status(400).json({
                   error: "code exists"
              });
            });
    }
    function upload(req, res) {

        var data = req.body;

            TaxonomyService.upload(data).then(function (result) {
                res.send(result);
            })
            .fail(function (err) {
                res.send(err);
                /*res.status(400).json({
                    error: "Speciality code exists"
                });*/
            });
    }

    function update(req, res) {
        var id = req.params.id;
        var data = req.body;

        TaxonomyService.update(id,data).then(function(result){
                res.send(result);
            })
            .fail(function(err){
                res.send(err);
            });

    }

    function getAllLevelsById(req,res){
        var id = req.params.id;
        TaxonomyService.getAllLevelsById(id).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function getByName (req,res) {
        var taxonomyName = req.query.taxonomyName;
        TaxonomyService.getByName(taxonomyName).then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function deleteAll(req,res){
        TaxonomyService.deleteAll().then(function(result){
            res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    this.resourcePath = '/taxonomy';
    this.description = "Operations about taxonomies";
    this.getMappings = function() {
        return {

            '/taxonomy': {
                post : {
                    callbacks: [create],
                    resource: 'Taxonomy',
                    action: 'create',
                    summary: "Add new speciality",
                    notes: "This method inserts speciality to the speciality's list.",
                    type: "Taxonomy",
                    parameters: [
                        paramType.body("body","Provide json object to Create","taxonomy",true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                get : {
                    callbacks: [getByName],
                    resource: 'Taxonomy',
                    action: 'Get Taxonomy By Name',
                    summary: "Get taxonomy",
                    notes: "This method fetches you speciality based on name",
                    type: "Taxonomy",
                    parameters: [
                        paramType.query("taxonomyName","Provide Speciality Name","string",true)
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/delete':{
                    'delete' : {
                        callbacks: [deleteAll],
                        resource: 'Taxonomy',
                        action: 'deleteAll',
                        summary: "deleteAll specialities",
                        notes: "This method inserts speciality to the speciality's list.",
                        type: "Taxonomy",
                        parameters: [
                           
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                },
                "/upload":{
                    post : {
                        callbacks: [upload],
                        resource: 'Taxonomy',
                        action: 'upload',
                        summary: "Add new speciality",
                        notes: "This method uploads taxonomy to the taxonomy's list.",
                        type: "Taxonomy",
                        parameters: [
                            paramType.body("body","Provide json object to Create","taxonomy",true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
               /* get : {
                    callbacks: [getList],
                    resource: 'Taxonomy',
                    action: 'getList',
                    summary: "Get the list of speciality's",
                    notes: "This method inserts speciality to the speciality's list.",
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },*/
                "/level/:no" :{
                    get : {
                        callbacks: [getTaxonomyByIdAndParent],
                        resource: 'Taxonomy',
                        action: 'getTaxonomyByIdAndParent',
                        summary: "Get the taxonomy list by level",
                        notes: "This method returns list of groupings or speciality or subspecialities",
                        parameters: [
                            paramType.path("no", "Enter level from [1,2,3,4]", "string", true),
                            paramType.query("parentCode", "Enter parentCode ", "string")
                            //paramType.query("level", "Enter level from [1,2,3,4]", "string")
                            //paramType.query("value", "Enter 'value' of the key like 'abc@abc.com' ", "string")
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                 "/level/nodivision/:no" :{
                    get : {
                        callbacks: [getTaxonomyByIdAndParentNoDivision],
                        resource: 'Taxonomy',
                        action: 'getTaxonomyByIdAndParentNoDivision',
                        summary: "Get the taxonomy list by level no separation",
                        notes: "This method returns list of groupings or speciality or subspecialities with out separation",
                        parameters: [
                            paramType.path("no", "Enter level from [1,2,3,4]", "string", true),
                            paramType.query("parentCode", "Enter parentCode ", "string")
                            //paramType.query("level", "Enter level from [1,2,3,4]", "string")
                            //paramType.query("value", "Enter 'value' of the key like 'abc@abc.com' ", "string")
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                '/:id':{
                    'put' : {
                        callbacks: [update],
                        resource: 'Taxonomy',
                        action: 'update',
                        summary: "updates the speciality by id",
                        notes: "This method accept the speciality code and feilds to be updated in json format",
                        type: "Object",
                        parameters: [
                            // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("id", "taxonomy code ", "string", true),
                            paramType.body("body","Provide json object to update","taxonomy",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getById],
                        resource: 'Taxonomy',
                        action: 'getById',
                        summary: "Get speciality details by code",
                        notes: "This method returns speciality details",
                        parameters: [
                            paramType.path("id", "speciality code", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    '/getAllLevelsIds' : {
                        'get' : {
                            callbacks: [getAllLevelsById],
                            resource: 'Taxonomy',
                            action: 'getAllLevelsById',
                            summary: "Get speciality details by code",
                            notes: "This method returns speciality details",
                            parameters: [
                                paramType.path("id", "speciality code", "string", true)
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
        return new TaxonomyAPI();
    }
};
