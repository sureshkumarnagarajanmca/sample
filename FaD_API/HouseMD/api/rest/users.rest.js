/**
 * Created by pradeep on 2/26/16.
 */
//var cpService = require('../services/Administration/ConsentPoliciesService'),
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    errorHandler = require('../serviceHandler').errorHandler,
    paramType = require('../validator/paramTypes.js');
var Users = require('../../db/dbModels/Users');
var UserService = require('../services/UserService');
var DcotorService = require('../services/DoctorService');
var LogininfoService = require('../services/LogininfoService');
var AppointmentService = require('../services/AppointmentService');
var AvailabilityService = require('../services/AvailabilityService');
var smsNotification = require('../../services/NotificationService/lib/sms');
var otpService = require('../services/otp.services');

// otpService.createAndSaveOtpForUsedId();

var logstash = require('../../logger/logstashCode');

var security = require('../../utils/crypto');

var errorFunctions = require('../errorCodeFunctions');

var Q = require('q');
var moment = require('moment');

var mongoose = require('mongoose'); 
/**
 * This Class Implements REST API for User creation
 */
function UsersAPI() {
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

    function getUserList(req,res){
        var id = req.params.userId;
        UserService.getUsersList().then(function(data){
          res.send(data);
        }).fail(function(err){
            res.send(err);
        });
    }

    function getUserById(req,res){
        var id = req.params.userId;
        UserService.getUserById(id).then(function(data){
            console.log(data);
            if(data.type==='doctor'){
                console.log(id);
                 DcotorService.getDoctorById(id).then(function(succDoctor){
                    res.send(succDoctor);
                 },function(error){
                    res.send(error);
                 });
            }else{
                res.send(data);
            }
        }).fail(function(err){
            res.send(err);
        });
    }

    function getUserByQuery(req,res){
        //var id = req.params.userId;
        var query = {};
        if(req.query){
            var key     = req.query.key;
            var value   = req.query.value;
            query[key] = value;
            UserService.findUserByQuery(query).then(function(data){
                res.send(data);
            })
            .fail(function(err){
                    res.send(err);
            });
        }
    }

    function createLoginAndUpdate(data){
        var deferred = Q.defer();
        var logininfo = {};
            logininfo.login = data.username;
            logininfo.pwdhash = data.password;
            logininfo.mobile = data.mobile;
            logininfo.countryCode = data.countryCode;
            logininfo.userId = data.userId;
            logininfo.source = data.source || "FaD";
            logininfo.mobileVerifiedInd = false;
            logininfo.emailVerifiedInd = false;
            logininfo.profVerfInd = false;
        if(data.type === 'doctor'){
            Q.all([
                LogininfoService.createLogin(logininfo),DcotorService.createDoctor(data)
            ]).then(function(succ){
                deferred.resolve({
                    "userId" : succ[0].userId
                });
            },function(error){
                deferred.reject(error);
            });
        }else{
            Q.all([
                LogininfoService.createLogin(logininfo)
            ]).then(function(succ){
                deferred.resolve({
                    "userId" : succ[0].userId
                });
            },function(error){
                deferred.reject(error);
            });
        }   
        return deferred.promise;
    }

    function createDoctor(data){
        var deferred = Q.defer();
        if(!!data.userId){
            UserService.updateUserMailAndMobile(data.userId,data)
            .then(function(updateUser){
                // console.log(updateUser);
                createLoginAndUpdate(data)
                .then(function(succ){
                    deferred.resolve(succ);
                },function(error){
                    deferred.reject(error);
                });
            },function(errorUdateUser){
                deferred.reject(errorUdateUser);
            })
        }else{
            UserService.createUser(data).then(function(user){
                data.userId = user.userId;
                createLoginAndUpdate(data)
                .then(function(succ){
                    deferred.resolve(succ);
                },function(error){
                    deferred.reject(error);
                });
            },function(error){
                deferred.reject(error);
            })
        }
        return deferred.promise;
    }



    function createNewUser(data){
        var deferred = Q.defer();
        UserService.createUser(data).then(function(user){
            data.userId = user.userId;
            createLoginAndUpdate(data)
            .then(function(succ){
                deferred.resolve(succ);
            },function(error){
                deferred.reject(error);
            });
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function doctorSignUpValidation(succ){
        // check for  email and mobile and npi
        var obj;
        if(!!succ[2]){
            console.log(succ[2].doctorType,!!(succ[2].doctorType !== 'black'))
            if(!!succ[0] && succ[1] && !!(succ[2].doctorType !== 'black')){
                obj = {
                    errCode: "ERREMAILMBLNPI"
                } 
                // check for  email and mobile
            }else if(!!succ[0] && !!succ[1] ){
                obj = {
                    errCode: "ERREMAILMBL"
                };
                // check for mobile and npi
            }else if(!!succ[1] && !!(succ[2].doctorType !== 'black')){
                obj = {
                    errCode: "ERRMBLNPI"
                };
                // check for mail and npi
            }else if(!!succ[0] && !!(succ[2].doctorType !== 'black')){
                obj = {
                    errCode: "ERREMAILNPI"
                };
            }else if(!!succ[0]){
                obj = {
                    errCode: "ERREMAIL"
                };
            }else if(!!succ[1]){
                obj = {
                    errCode: "ERRMBL"
                };
            }else if(!!(succ[2].doctorType !== 'black')){
                obj = {
                    errCode: "ERRNPI"
                };
            }
        }else{
            if(!!succ[0] && !!succ[1] ){
                obj = {
                    errCode: "ERREMAILMBLNEWNPI"
                };
                // check for mobile and npi
            }else if(!!succ[0]){
                obj = {
                    errCode: "ERREMAILNEWNPI"
                };
            }else if(!!succ[1]){
                obj = {
                    errCode: "ERRMBLNEWNPI"
                };
            }else{
                // NEW NPI for the registered Doctor
                obj = {
                    errCode: "ERRNEWNPI"
                }
            }
        }
        return obj;
    }

    function createUser(req, res, next) {
        var data = JSON.parse(JSON.stringify(req.body));
        data.password = security.encrypt(data.password);
        if(data.type === 'doctor'){
            Q.all([
                LogininfoService.checkEmailOnProfileVerifiedInd(data.username),
                LogininfoService.checkMobileOnProfileVerifiedInd(data.mobile),
                DcotorService.getDoctorByNpi(data.npi)
            ]).then(function(doctorValidationData){  
                // console.log(doctorValidationData);
                var errorDOctorSignUpValdtin = doctorSignUpValidation(doctorValidationData);
                if(!!errorDOctorSignUpValdtin){
                     res.status(401).send(errorDOctorSignUpValdtin);    
                    // if(errorDOctorSignUpValdtin !== "newNPI"){
                    //     res.status(401).send(errorDOctorSignUpValdtin);                       
                    // }else{
                    //     // res.send("new Npi");
                    //    // register Doctor With the new Npi Npi must Be verified   
                    //     createNewUserForDoctor(data)
                    //     .then(function(user){
                    //         createDoctor(data).then(function(userIdObject){
                    //           // generating otp 
                    //              console.log("Asdasdasdasdas")
                     
                    //             otpService.createAndSaveOtpForUsedId(userIdObject.userId)
                    //             .then(function(otp){
                    //                 // sending otp via sms
                    //                 sendSms(data.mobile,data.countryCode,otp)
                    //                 .then(function(succ){
                    //                     // on successfull otp delivery via sms
                    //                      res.send({ userId : data.userId});
                    //                 },function(err){
                    //                     // res.sendInternalServerError
                    //                     errorFunctions.sendInternalServerError(req,res);
                    //                     // res.send(err);
                    //                 })
                    //             },function(err){
                    //                 res.status(401).send(err); 
                    //             });
                                
                    //         },function(errorCreatingDoctor){
                    //             // res.send(errorCreatingDoctor);
                    //             errorFunctions.sendInternalServerError(req,res);
                    //         });   
                    //     },function(fail){
                    //         errorFunctions.sendInternalServerError(req,res);
                    //         // res.send(fail);
                    //     })
                              
                    // }

                }else{
                    // registering Doctor with the existing Npi Id in database.
                    // res.send("existingN Npi");
                    data.userId = doctorValidationData[2].userId;
                    // console.log(data.userId);
                    
                    UserService.getUserById(data.userId).then(function(userInformation){
                        if(!!userInformation){
                            createDoctor(data).then(function(userIdObject){
                            // res.send(userId);
                                otpService.createAndSaveOtpForUsedId(userIdObject.userId)
                                .then(function(otp){
                                    // sending otp via sms
                                    sendSms(data.mobile,data.countryCode,otp)
                                    .then(function(succ){
                                        // on successfull otp delivery via sms
                                         res.send({ userId : data.userId}); 
                                    },function(err){
                                        console.log(err)
                                        // console.log(errorFunctions.sendInternalServerError);
                                        errorFunctions.sendInternalServerError(req,res);
                                    })
                                },function(err){
                                console.log(err);
                                    res.status(401).send(err); 
                                });
                            },function(errorCreatingDoctor){
                            // res.send(errorCreatingDoctor);
                                    errorFunctions.sendInternalServerError(req,res);
                            }); 
                        }else{
                            createNewUserForDoctor(data)
                            .then(function(user){
                                createDoctor(data).then(function(userIdObject){
                                  // generating otp 
                                    otpService.createAndSaveOtpForUsedId(userIdObject.userId)
                                    .then(function(otp){
                                        // sending otp via sms
                                        sendSms(data.mobile,data.countryCode,otp)
                                        .then(function(succ){
                                            // on successfull otp delivery via sms
                                             res.send({ userId : data.userId});
                                        },function(err){
                                            // res.send(err);
                                            errorFunctions.sendInternalServerError(req,res);
                                        })
                                    },function(err){
                                        res.status(401).send(err); 
                                    });
                                    
                                },function(errorCreatingDoctor){
                                    // res.send(errorCreatingDoctor);
                                    console.log(errorCreatingDoctor);
                                    errorFunctions.sendInternalServerError(req,res);
                                });   
                            },function(fail){
                                // res.send(fail);
                                console.log(fail);
                                errorFunctions.sendInternalServerError(req,res);
                            })
                        }
                    })
                }
            },function(error){
                console.log(error);
            });
        }else{
            // user registration
             Q.all([
                LogininfoService.checkEmailOnProfileVerifiedInd(data.username),
                LogininfoService.checkMobileOnProfileVerifiedInd(data.mobile)
            ]).then(function(succ){
                if(!!succ[0] || !!succ[1]){
                    res.send({
                        errCode: "ERREMAILMBL"
                    }); 
                }else if(!!succ[0]){
                    res.send({
                        errCode: "ERREMAIL"
                    });
                }else if(!!succ[1]){
                    res.send({
                        errCode: "ERRMBL"
                    });
                }else{
                    createNewUser(data).then(function(userIdObject){
                        // generating otp 
                        otpService.createAndSaveOtpForUsedId(userIdObject.userId)
                        .then(function(otp){
                            console.log(otp)
                            // sending otp via sms
                            sendSms(data.mobile,data.countryCode,otp)
                            .then(function(succ){
                                // on successfull otp delivery via sms
                                 res.send({ userId : data.userId});
                            },function(err){
                                // res.send(err);
                                console.log(err);
                                errorFunctions.sendInternalServerError(req,res);
                            })
                        },function(err){
                        console.log(err);
                            res.status(401).send(err); 
                        });
                    },function(error){
                        // res.send(error);
                        console.log(error);
                        errorFunctions.sendInternalServerError(req,res);
                    });
                }
            },function(errorFindingUserName){
                console.log(errorFindingUserName);
                errorFunctions.sendInternalServerError(req,res);
            });
        }
    }
    
    function createNewUserForDoctor(userInfo){
        'use strict';

        var deferred = Q.defer();
        UserService.createNewUserForDoctor(userInfo).then(function(user){
            deferred.resolve(user);
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    }

    // function sendOtp(mobile,countryCode){
    //     'use strict';
    //     var deferred = Q.defer();
    //     var payload = {
    //         mobile : mobile,
    //         countryCode : +91
    //     }
    //     smsNotification.sendVerificationToken(payload)
    //     .then(function(succ){
    //         deferred.resolve(succ);
    //     },function(err){
    //         console.log(err);
    //         deferred.reject(succ);
    //     });
    //     return deferred.promise;
    // }

    function sendSms(mobile,countryCode,message){
        'use strict';
        var deferred = Q.defer();
		var smsmessage = 'Your Authorization Code for FINDaDOCTOR registration is ' + message + '. This is a one-time authorization code to verify your registration.';
        var payload = {
            mobile : mobile,
            countryCode : countryCode || +91,
            message : smsmessage
        }
       smsNotification.sendSms(payload)
        .then(function(succ){
            deferred.resolve(succ);
        },function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var data = req.body;
        UserService.updateUser(id,data).then(function(result){
           res.send(result);
        })
        .fail(function(err){
            res.send(err);
        });
    }

    function deleteUser(req, res) {
        var id = req.params.id;

        UserService.deleteUser(id).then(function(result){
                res.send(result);
        })
        .fail(function(err){
                res.send(err);
        });
   }

   function bookAppointment(req, res) {
        var id = req.params.id;

        res.send("Successfully booking confirmed")
   }

    function getAppointments(req,res){
        var userId = req.params.userId;
        var querObj  = {};
        if(!!req.query.startTime && !!req.query.endTime){
            querObj.startTime = req.query.startTime;
            querObj.endTime = req.query.endTime;
        }
        AppointmentService.getAppointmentsofUser(userId,querObj)
        .then(function(succ){
            // console.log(succ);
            res.send(succ);
        },function(err){
            console.log(err);
            res.status(401);
            res.send(err);
        })
    }

    function createAppointment(req,res){
        var userId = req.params.userId;
        var data = req.body;
        data.userId = userId;
        AvailabilityService.getDoctorAvailabilityObject(data.doctorId).then(function(availabilityObj){

            var key  = moment(data.startTime).days()+"-"+((moment(data.startTime).hours()*60)+(moment(data.startTime).minutes()))+"-"+((moment(data.endTime).hours()*60)+(moment(data.endTime).minutes()));
            console.log(key);

            console.log(availabilityObj.availability);
            var checkSlotAVailabilityForDoctor = availabilityObj.availability[key];
            if(checkSlotAVailabilityForDoctor){
                var allowedSlots = availabilityObj.availability[key].allowedSlots;
                var queryObj = {};
                queryObj.startTime = data.startTime;
                queryObj.endTime = data.startTime;
                queryObj.orgId = data.orgId;
                AppointmentService.getAppointmentsofDoctor(data.doctorId,queryObj)
                .then(function(appointments){
                    
                    if(appointments.length < allowedSlots){
                  
                        AppointmentService.createAppointment(data)
                        .then(function(succ){
                    console.log("test");
                            res.send(succ);
                            logstash.pushappointmentDataIntoAppointments(succ).then(function(succInfo){
                                // console.log(succInfo)
                            });
                        },function(err){
                            console.log(err);
                        });
                    }else{
                        res.send("Maximum bookings reched for this slot");
                        // cant create more more apointments for the doctor
                    }
                    // res.send(succ);
                    console.log(succ);
                },function(err){

                });
            }else{
                res.status(401);
                res.send("Please check doctor availability");
            }

            
        },function(err){
            res.send(err);
        })
            
    }
    function cancelAppointment(req,res){
        var userId = req.params.userId;
        var appointmentId = req.params.appointmentId;  
        AppointmentService.cancelAppointmentByUser(appointmentId,userId).
        then(function(succ){
            res.send(succ);
            logstash.pushappointmentDataIntoAppointments(succ).then(function(succInfo){
                console.log(succInfo)
            });
        },function(err){
            res.status(401);
            res.send(err);
        })      
    }

    this.resourcePath = '/users';
    this.description = "Operations about users";
    this.getMappings = function() {
        return {
            '/users': {
               '/signup' : {
                   post : {
                       callbacks: [createUser],
                       resource: 'User',
                       action: 'createUser',
                       summary: "create user",
                       notes: "This method creates user.",
                       type: "String",
                       parameters: [
                           paramType.body("body","Provide json object to Create","userLogin",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
               },
                '/:userId':{
                    'put' : {
                        callbacks: [updateUser],
                        resource: 'User',
                        action: 'updateUser',
                        summary: "updates the user by id",
                        notes: "This method accept the userid and feilds to be updated",
                        type: "Object",
                        parameters: [
                           // paramType.header("authorization", "access token to", "string", false),
                            paramType.path("userId", "Userid of the FAD Application User", "string", true),
                            /*paramType.body("username","Enter your preffered username","string",false),
                            paramType.body("password","Password length minimum 8 characters","string",false),*/
                            paramType.body("body","Provide json object to update","userProfileObject",true),

                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'get' : {
                        callbacks: [getUserById],
                        resource: 'User',
                        action: 'getUserById',
                        summary: "getUserList",
                        notes: "This method returns list of users",
                        parameters: [
                            paramType.path("userId", "User id ", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    'delete': {
                        callbacks: [deleteUser],
                        resource: 'User',
                        action: 'deleteUser',
                        summary: "delete user by id",
                        notes: "This method deletes user by id.",
                        parameters: [
                            paramType.path("userId", "User id ", "string", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    },
                    '/appointment' : {
                        'post' : {
                            callbacks: [createAppointment],
                            resource: 'Appointment',
                            action: 'createAppointment',
                            summary: "create aa appointment",
                            notes: "This method creates new Appointment",
                            type: "Object",
                            parameters: [
                                paramType.path("userId", "User id ", "string", true),
                                paramType.body("body","Provide json object to Create","appointmentObject",true)
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                        'get' : {
                            callbacks: [getAppointments],
                            resource: 'Appointment',
                            action: 'getAppointments',
                            summary: "create retrives you list of  appointments",
                            notes: "This method returns Appointments",
                            type: "Object",
                            parameters: [
                                paramType.path("userId", "User id ", "string", true),
                                paramType.query("startTime", "Provide start time in millisecinds","number"),
                                paramType.query("endTime", "Provide endTime In milliseconds","number")
                            ],
                            responseMessages: [{
                                "code": 400,
                                "message": "Invalid parameters"
                            }]
                        },
                        '/:appointmentId' :{
                            'delete' : {
                                callbacks: [cancelAppointment],
                                resource: 'Appointment',
                                action: 'cancelAppointment',
                                summary: "cancels appointment",
                                notes: "This method cancels Appointments",
                                type: "Object",
                                parameters: [
                                    paramType.path("userId", "User id ", "string", true),
                                    paramType.path("appointmentId", "appointmentId id ", "string", true)
                                ],
                                responseMessages: [{
                                    "code": 400,
                                    "message": "Invalid parameters"
                                }]
                            }
                        }
                    }
                }
            }

        };
    };
}

module.exports = {
    getInst : function() {
        return new UsersAPI();
    }
};
