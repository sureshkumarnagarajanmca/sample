/**
 * Created by pradeep on 3/6/16.
 */
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var DoctorService = require('../services/DoctorService');
var AvailabilityService = require('../services/AvailabilityService');
var Leave = require('../services/LeaveService');
var UserService = require('../services/UserService');
var AppointmentService = require('../services/AppointmentService');
var security = require('../../utils/crypto');

var logstash = require('../../logger/logstashCode');

var errorFunctions = require('../errorCodeFunctions');

//var security = require('../../utils/crypto');

var Q = require('q');
/**
 * This Class Implements REST API for Doctor
 */
function DoctorsAPI() {
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

    function createDoctorUser(req, res) {
        var data = req.body;
        data.type = "doctor";
          DoctorService.getDoctorByNpi(data.npi)
            .then(function(doctor){
                if(doctor){
                    data.userId = doctor.userId;
                    uploadDoctor(data).then(function(succ){
                        res.send(succ);
                    },function(err){
                          res.send(err);
                    })
                }else{
                    UserService.createDoctorOnUpload(data).then(function(result){
                        data.userId = result._id;
                        uploadDoctor(data).then(function(succ){
                            res.send(succ);
                        },function(err){
                           res.send(err);
                        })
                    })
                    .fail(function(err){
                            res.send(err);
                    }); 
                }
            },function(err){
                errorFunctions.sendInternalServerError(req,res);
                // res.send(err);
            })
    }


    function uploadDoctor(data) {
        var deferred = Q.defer();
        DoctorService.uploadDoctor(data).then(function(result){
                 console.log("data of doctor");
                 console.log(result);
            if(result === 'registeredDoctor' ){
                deferred.resolve();
            }else{
                if(!result.oldDoc){
                    logstash.pushDoctorDataOnPractiseLocation(result.newDoc,function(){
                            console.log("elastic search result : ");
                           console.log(result);
                         deferred.resolve(result);
                          console.log("**********************************");
                    });
                }else{
     //               logstash.deleteDocumentFromDoctorAddress(result.oldDoc)
    //               .then(function(logData){   
    //                  console.log(logData); 
                        logstash.pushDoctorDataOnPractiseLocation(result.newDoc,function(){
                             deferred.resolve(result);
                        });
   //                 });
                }
            }
        })
        .fail(function(err){
            console.log(err);
             deferred.reject(err);
           // deferred.reject({'error':err.message});
               
        });

        return deferred.promise;
    }

    function getDoctorById(req,res){
        var id = req.params.doctorId;
        DoctorService.getDoctorById(id).then(function(data){
            if(data){
                res.send(data);
            }else{
                errorFunctions.userNotFoundError(req,res);                
            }
        }).fail(function(err){
            errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    // function getDoctorByUserId(req,res){
    //     var id = req.params.doctorId;
    //     DoctorService.getDoctorByUserId(id).then(function(data){
    //         if(data){
    //             res.send(data);
    //         }else{
    //             errorFunctions.userNotFoundError(req,res);                
    //         }
    //     }).fail(function(err){
    //         errorFunctions.sendInternalServerError(req,res,err);
    //     });
    // }

    function getDoctorByNpi(req,res){
        var npi = parseInt(req.params.id);
        DoctorService.getDoctorByNpi(npi).then(function(data){
            if(data){
                res.send(data);
            }else{
                errorFunctions.userNotFoundError(req,res);                
            }
        }).fail(function(err){
            errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function getDoctorByQuery(req,res){
        var query = {};

        if(req.query){
            var key     = req.query.key;
            var value   = req.query.value;

            query[key] = value;

            DoctorService.getDoctorByQuery(query).then(function(data){
                    res.send(data);
            })
            .fail(function(err){
                    res.send(err);
            });
        }
    }

    function createDoctor(req, res) {
            var data = req.body;
            DoctorService.createDoctor(data).then(function(result){
                if(result){
                    res.send(result);
                }else{
                    console.log(err);
                }
            })
            .fail(function(err){
                errorFunctions.sendInternalServerError(req,res,err);
            });
    }

    function updateDoctor(req, res) {
        'use strict';
        var id = req.params.doctorId;
        var data = req.body;
        DoctorService.updateDoctor(id,data).then(function(result){
            if(result){
              

                res.send(result.newData);
                //UPDATE TO LOGSTASH deleting otheraddress
                // if(!!result.newData.otherAddress){
                //     if(result.newData.otherAddress.length>0){
                //         logstash.deleteDocumentFromDoctorAddress(result.newData)
                //         .then(function(logData){
                //         }); 
                //     }    
                // }

                //UPDATE TO LOGSTASH deleting otheraddress
             /*   if(!!result.oldData.otherAddress){
                    if(result.oldData.otherAddress.length>0){
                        logstash.deleteDocumentFromDoctorAddress(result.oldData)
                        .then(function(logData){
                          console.log("removing removing");
                        }); 
                    }    
                }
               */ 
                //delete old orgids and add new orgids TO LOGSTASH

                var deleteArray = getOrgIdsToDeleteFromMongodb(result);
                   console.log("delete array : ")
                 console.log(deleteArray)
               
                 if(deleteArray.length > 0){
                   logstash.deleteDocumentFromDoctorAddressOnOrgId(id,deleteArray)
                   .then(function(succ){}); 
                }
             
            
                  
                if(!!result.newData.otherAddress){
                   console.log("step1 :");  
                   if(result.newData.otherAddress.length  > 0){
                      
                       logstash.pushUpdateDoctorAddressDocument(result.newData)
                        .then(function(succ){
                              })
                    }
                }
            }else{
                errorFunctions.userNotFoundError(req,res);   
            }
        })
        .fail(function(err){
            console.log(err);
            errorFunctions.sendInternalServerError(req,res,err);
        });
    }


    function getOrgIdsToDeleteFromMongodb(data){
        'use strict'
        var deleteOrgIdsArray = [];
        if(!!data.oldData.orgIds){
            if(data.oldData.orgIds.length > 0){
                for(let orgOld of data.oldData.orgIds){
                    let flag = false
                    for(let orgNew of data.newData.orgIds){
                        if(orgOld.orgId.toString() == orgNew.orgId._id.toString()){
                            flag = true;
                            break;
                        }
                    }
                    if(!flag){
                        deleteOrgIdsArray.push(orgOld.orgId);
                    }
                }
            }
        }
        return deleteOrgIdsArray;
    }

    function updateDoctorSchedule(req, res) {
        var id = req.params.doctorId;
        var data = req.body;
        data.doctorId = id;
        AvailabilityService.updateDoctorAvailabilityOnWeek(data).then(function(result){
            if(result){
                res.send(result);
                DoctorService.getDoctorById(id).then(function(doctor){
                     logstash.pushAvailabilityOfDOctorOnLocation(doctor,result.dayTimeAvailbility,data)
                        .then(function(succ){

                    },function(fail){
                        console.log(fail)
                        errorFunctions.sendInternalServerError(req,res,fail);
                    });
                }).fail(function(err){
                    console.log(err);
                });
            }else{
                console.log(err)
            }
            
        },function(err){
            errorFunctions.sendInternalServerError(req,res,err);
        })
    }

    function getDoctorAvailability(req, res) {
        var id = req.params.doctorId;
        // need to check for doctor 
        AvailabilityService.getDoctoravailability(id).then(function(result){
            res.send(result);
        },function(err){
             errorFunctions.sendInternalServerError(req,res,err);
        })
    }

    function saveDoctorLeave(req, res) {
        var id = req.params.doctorId;
        var data = req.body;
        data.doctorId = id;
        Leave.saveDoctorLeave(data).then(function(succ){
            res.send(succ);
            succ.leave = "Leave";
            logstash.pushleaveDataIntoAppointments(succ);
        },function(err){
            errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function deleteDoctorLeave(req, res){
        var doctorId = req.params.doctorId;
        var leaveId = req.params.leaveId;
        Leave.deleteDoctorLeave(leaveId,doctorId).then(function(succ){
            res.send(succ);
            succ.leave = "Leave";
            logstash.deleteLeaveDataInAppointments(leaveId);
        },function(err){
             errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function getDoctorLeaves(req, res) {
        var id = req.params.doctorId;
        var queryObj = {}
        if(req.query.orgId){
            queryObj.orgId = req.query.orgId;
        }
        if(req.query.startTime){
            queryObj.startTime = req.query.orgId;
        }
        if(req.query.endTime){
            queryObj.endTime = req.query.orgId;
        }
        var orgId = req.query.orgId;
        Leave.getDoctorLeaves(id,queryObj).then(function(succ){
            res.send(succ);
        },function(err){
             errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function updateDoctorLeave(req, res){
        var doctorId = req.params.doctorId;
        var leaveId = req.params.leaveId;
        var data = req.body;
        Leave.deleteDoctorLeave(leaveId,doctorId).then(function(succ){
            // succ.leave = "Leave";
            logstash.deleteLeaveDataInAppointments(leaveId);
            data.doctorId = doctorId;
            Leave.saveDoctorLeave(data).then(function(succ){
                res.send(succ);
                succ.leave = "Leave";
                logstash.pushleaveDataIntoAppointments(succ);
            },function(err){
                res.status(401);
            });
        },function(err){
             errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function getAppointments(req,res){
        var doctorId  = req.params.doctorId;
        // var queryObj = req.query;
        AppointmentService.getAppointmentsofDoctor(doctorId,req.query)
        .then(function(succ){
            res.send(succ);
        },function(err){
             errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function cancelAppointmentByDoctor(req,res){
        var doctorId = req.params.doctorId;
        var appointmentId = req.params.appointmentId; 
        AppointmentService.cancelAppointmentByDoctor(appointmentId,doctorId)
        .then(function(succ){
            res.send(succ);
            logstash.pushappointmentDataIntoAppointments(succ).then(function(succInfo){
                // console.log(succInfo)
            });
        },function(err){
             errorFunctions.sendInternalServerError(req,res,err);
        });       
    }


    this.resourcePath = '/doctors';
    this.description = "Operations about doctors";
    this.getMappings = function() {
        return {
            '/doctors': {
                post : {
                    callbacks: [createDoctor],
                    resource: 'Doctor',
                    action: 'createDoctor',
                    summary: "create a doctor",
                    notes: "This method creates new Doctor.",
                    type: "Object",
                    parameters: [
                        /* paramType.header("authorization", "access token to", "string", false),
                         paramType.body("firstName","Enter your first name","string",false),
                         paramType.body("lastName","Enter your last name","string",false)*/
                        paramType.body("body","Provide json object to Create","doctor",true),
                    ],
                    responseMessages: [{
                        "code": 400,
                        "message": "Invalid parameters"
                    }]
                },
                '/upload':{
                    post : {
                        callbacks: [createDoctorUser],
                        resource: 'Doctor',
                        action: 'uploadDoctor',
                        summary: "upload a doctor",
                        notes: "This method uploads the Doctor.",
                        type: "Object",
                        parameters: [
                            /* paramType.header("authorization", "access token to", "string", false),
                             paramType.body("firstName","Enter your first name","string",false),
                             paramType.body("lastName","Enter your last name","string",false)*/
                            paramType.body("body","Provide json object to upload the doctor","doctorUpload",true),
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]

                    }
                },
                '/query':{
                    'get' :{
                        callbacks: [getDoctorByQuery],
                        resource: 'Doctor',
                        action: 'getDoctorByQuery',
                        summary: "getDoctorByQuery",
                        notes: "This method returns list of doctor by query ex: key = 'firstName' and value = 'Jhon'",
                        parameters: [
                            paramType.query("key", "Enter 'key' field like firstName or phoneNo..etc ", "string", true),
                            paramType.query("value", "Enter 'value' of the key like 'Jhon' ", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                '/:doctorId':{
                    'put' : {
                        callbacks: [updateDoctor],
                        resource: 'Doctor',
                        action: 'updateDoctor',
                        summary: "updates the doctor by id",
                        notes: "This method accept the doctorId and feilds to be updated",
                        type: "Object",
                        parameters: [
                            // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true),
                            /*paramType.body("username","Enter your preffered username","string",false),
                             paramType.body("password","Password length minimum 8 characters","string",false),*/
                            paramType.body("body","Provide json object to update","doctor",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getDoctorById],
                        resource: 'Doctor',
                        action: 'getDoctorById',
                        summary: "getDoctorById",
                        notes: "This method returns doctors details",
                        parameters: [
                            paramType.path("doctorId", "doctorId ", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    '/availability' : {
                        'put' : {
                            callbacks: [updateDoctorSchedule],
                            resource: 'Doctor',
                            action: 'updateDoctorSchedule',
                            summary: "updates the doctor schedule by doctorId",
                            notes: "This method accept the doctorId and feilds to be updated",
                            type: "Object",
                            parameters: [
                                paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true),
                                paramType.body("body","Provide json object to update","doctorScheduleForOrganization",true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        }, 
                        'get' : {
                            callbacks: [getDoctorAvailability],
                            resource: 'Doctor',
                            action: 'getDoctorAvailability',
                            summary: "get the doctor schedule by doctorId",
                            notes: "This method accept the doctorId and feilds to be updated",
                            type: "Object",
                            parameters: [
                                paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },    
                    },
                    '/leave' : {
                        'post' : {
                            callbacks: [saveDoctorLeave],
                            resource: 'Doctor',
                            action: 'saveDoctorLeave',
                            summary: "inserts doctor leave data by doctorId",
                            notes: "This method accept the doctorId and feilds to be updated",
                            type: "Object",
                            parameters: [
                                paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true),
                                paramType.body("body","Provide json object to update","leaveObject",true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                        'get' : {
                            callbacks: [getDoctorLeaves],
                            resource: 'Doctor',
                            action: 'getDoctorLeaves',
                            summary: "get doctor leave data by doctorId",
                            notes: "This method accept the doctorId ot fetch the Doctor Leaves",
                            type: "Object",
                            parameters: [
                                paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true),
                                paramType.query("orgId", "Provide json object to update","string"),
                                paramType.query("startTime", "Provide start time in millisecinds","number"),
                                paramType.query("endTime", "Provide endTime In milliseconds","number")
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                        '/:leaveId':{
                            'put' : {
                                callbacks: [updateDoctorLeave],
                                resource: 'Doctor',
                                action: 'updateDoctorLeave',
                                summary: "udate doctor leave",
                                notes: "This method accept the doctorId and feilds to be updated",
                                type: "Object",
                                parameters: [
                                    paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true),
                                    paramType.path("leaveId", "leaveId","string",true),
                                    paramType.body("body","Provide json object to update","leaveObject",true)
                                ],
                                responseMessages: [{
                                    "code": 400,
                                    "message": "Invalid parameters"
                                }]
                            },
                            'delete' :{
                                callbacks: [deleteDoctorLeave],
                                resource: 'Doctor',
                                action: 'deleteDoctorLeave',
                                summary: "delete doctor leaves  by leaveId",
                                notes: "This method accept the doctorId ot fetch the Doctor Leaves",
                                type: "Object",
                                parameters: [
                                    paramType.path("doctorId", "doctorId of the FAD Application Doctor", "string", true),
                                    paramType.path("leaveId", "leaveId","string",true)
                                ],
                                responseMessages: [{
                                    "code": 400,
                                    "message": "Invalid parameters"
                                }]
                            }
                        }
                    },
                    '/appointments' :{
                        'get' :{
                            callbacks: [getAppointments],
                            resource: 'Doctor',
                            action: 'getDoctor Appointments',
                            summary: "getDoctor Appointments",
                            notes: "This method returns doctors appointments",
                            parameters: [
                                paramType.path("doctorId", "doctorId ", "string", true),
                                paramType.query("orgId", "Provide json object to update","string"),
                                paramType.query("startTime", "Provide start time in millisecinds","number"),
                                paramType.query("endTime", "Provide endTime In milliseconds","number")
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                        '/:appointmentId' : {
                            'delete'  : {
                                callbacks: [cancelAppointmentByDoctor],
                                resource: 'Doctor',
                                action: 'cancel Appointments',
                                summary: "cancel Doctor Appointment",
                                notes: "This method cancels the selected appointment",
                                parameters: [
                                    paramType.path("doctorId", "doctorId ", "string", true),
                                    paramType.path("doctorId", "appointmentId ", "string", true)
                                    // paramType.body("body", "the search parameters", "searchDoctorAppointmentObj", true)
                                ],
                                responseMessages: [{
                                    "code": 400,
                                    "message": "Invalid parameters"
                                }]
                            }
                        }
                    }
                    // '/appointments'{
                    //     'post' : {
                    //         callbacks: [getAppointments],
                    //         resource: 'Doctor',
                    //         action: 'getDoctor Appointments',
                    //         summary: "getDoctor Appointments",
                    //         notes: "This method returns doctors appointments",
                    //         parameters: [
                    //             paramType.path("doctorId", "doctorId ", "string", true),
                    //             paramType.body("body", "the search parameters", "searchDoctorAppointmentObj", true)
                    //         ],
                    //         responseMessages: [{
                    //             "code": 400,
                    //             "message": "Invalid parameters"
                    //         }]
                    //     }
                    // }
                },
                // deleteDoctorLeave
                '/npi/:id':{
                    'get' : {
                        callbacks: [getDoctorByNpi],
                        resource: 'Doctor',
                        action: 'getDoctorByNpi',
                        summary: "Get doctor details by npi number",
                        notes: "This method returns doctors details of the specified npi",
                        parameters: [
                            paramType.path("id", "enter doctor's npi number", "number", true)
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
        return new DoctorsAPI();
    }
};
