/**
 * Created by pradeep on 3/8/16.
 */
var appControlListService = require('../services/AppControlListService.js'),
    errors = require('../errors'),
    passport            =  require('passport'),
    paramType = require('../validator/paramTypes.js');

var LogininfoService = require('../services/LogininfoService');
var AccessTokenService = require('../services/AccessTokenServices');
var UserService = require('../services/UserService');
var smsNotification = require('../../services/NotificationService/lib/sms'),
    DoctorService = require('../services/DoctorService'),
    otpService = require('../services/otp.services');

var security = require('../../utils/crypto');

var errorFunctions = require('../errorCodeFunctions');

var Q = require('q');

var errorFunctions = require('../errorCodeFunctions');

/**
 * This Class Implements REST API for Logininfo
 */
function LogininfoAPI() {
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

    function signup(req,res){
        var data = req.body;
        if(data.pwdhash = security.encrypt(data.password)){
            LogininfoService.createLogin(data).then(function(result){
                    res.send(result);
            })
            .fail(function(err){
                    res.send(err);
            });
        }else{
            res.send({'mesg':'Error while signup'});
        }
    }

    function login(req,res){
        var result = req.token;
        result.userId = req.user.userId;   
        res.send(result);
    }

    function forgotPassword(req, res){
        var userId = req.body.userId;
        var password = req.body.password;
        LogininfoService.resetpassword(userId, security.encrypt(password)).then(function (result) {
            if(result){
             res.send(result);              
            }else{
              errorFunctions.userNotFoundError(req,res); 
            }
        },function(err){
             errorFunctions.sendInternalServerError(req,res); 
        });
    }

    function restePassword(req, res){
        var userId = req.body.userId;
        var newPassword = req.body.newPassword;
        var oldPassword = req.body.pervPassword;
        LogininfoService.checkLogin(userId)
        .then(function (result) {
            if(!!result){
              if(result.pwdhash === security.encrypt(oldPassword)){
                LogininfoService.resetpassword(userId, security.encrypt(newPassword)).then(function (result) {
                    res.send(result);
                },function(err){
                    errorFunctions.userNotFoundError(req,res);
                });
              }else{
                errorFunctions.incorrectPassword(req,res);  
              }
            }else{
              errorFunctions.userNotFoundError(req,res);   
            }
        },function(err){

            errorFunctions.sendInternalServerError(req,res,err);
        });
    }

    function generateOtp(req,res){
        'use strict'
        var username = req.query.username;
      
        LogininfoService.getUserByLoginOnEmailOrMobileOnProfileVerfInd(username)
        .then(function(userObject){
            if(userObject){
              otpService.createAndSaveOtpForUsedId(userObject.userId)
              .then(function(otp){
                  // sending otp via sms
                  console.log(userObject);
                  sendSms(userObject.mobile,userObject.countryCode,otp)
                  .then(function(succ){
                      // on successfull otp delivery via sms
                       res.send({ username : username}); 
                  },function(err){
                      res.send(err);
                  })
              },function(err){
                console.log(err);
                  res.send(err); 
              });
            }else{
              // user not registered error needs to be implemented
              errorFunctions.userNotFoundError(req,res);
            }
        },function(err){
            errorFunctions.sendInternalServerError(req,res);
        });
    }

    function reGenerateOtponSIgnup(req,res){
        'use strict'
        var username = req.query.username;
      
        LogininfoService.getUserByLoginOnEmailOrMobile(username)
        .then(function(userObject){
            if(userObject){
              otpService.createAndSaveOtpForUsedId(userObject.userId)
              .then(function(otp){
                  // sending otp via sms
                  console.log(userObject);
                  sendSms(userObject.mobile,userObject.countryCode,otp)
                  .then(function(succ){
                      // on successfull otp delivery via sms
                       res.send({ username : username}); 
                  },function(err){
                      res.send(err);
                  })
              },function(err){
                console.log(err);
                  res.send(err); 
              });
            }else{
              // user not registered error needs to be implemented
              errorFunctions.userNotFoundError(req,res);
            }
        },function(err){
            errorFunctions.sendInternalServerError(req,res);
        });
    }

    function generateNewAccessToken(req,res,next){
        res.send({
            "accessToken" : req.token.accessToken
        });
    }

    function sendSms(mobile,countryCode,message){
        'use strict';
        var deferred = Q.defer();
        var payload = {
            mobile : mobile,
            countryCode : countryCode || +91,
            message : message
        }
        smsNotification.sendSms(payload)
        .then(function(succ){
            deferred.resolve(succ);
        },function(err){
            deferred.reject(succ);
        });
        return deferred.promise;
    }

    // profile will be verified
    function verifyOtp(req,res,next){
        'use strict'
        // get userId from login  Schema

        var username = req.body.username;
        var otp = req.body.otp;
        LogininfoService.getUserByLoginOnEmailOrMobileOnProfileVerfInd(username).then(function(user){
            var user = user.toObject();
            otpService.verifyOtpByUserId(user.userId,otp)
            .then(function(succ){
              console.log("Verified");
               // res.send({succ : succ});
               req.user = user;
               next();
            },function(err){
              console.log(err);
              // res.status.send(err);
              errorFunctions.findOtpError(req,res,err);
              // errorFunctions.sendInternalServerError(req,res);
            })
        }).fail(function(err){
          errorCodeFunctions.sendInternalServerError(req,res)
            // res.send({'msg':'Error while login'});
        });
    }

    function verifyOtpOnSignUp(req,res,next){
        'use strict'
        var userId = req.body.userId;
        var otp = req.body.otp;
        // console.log("Verified");
        console.log(userId);
        UserService.getUserById(userId).then(function(userObject){
          userObject = userObject.toObject();
          console.log(userObject);
          otpService.verifyOtpByUserId(userId,otp)
          .then(function(succ){
             if(userObject.type === 'doctor'){
                // for doctor
                // update email doctorType and mobileNumber of doctor.update profile Indicator
                Q.all([
                    DoctorService.updateEmailMobileAndDoctorTypeOnUserId(userId,userObject),
                    LogininfoService.updateLoginProfileIndicatorWithTure(userId)
                ]).then(function(doctorValidationData){ 
                    next();
                },function(err){
                  res.send(401);
                  // console.log(err);
                })
              }else{
                // for user
                LogininfoService.updateLoginProfileIndicatorWithTure(userId).
                then(function(succ){
                   next();
                },function(err){
                  res.send(err);
                  errors.sendInternalServerError(req,res);
                })
              } 
          },function(err){
            console.log(err);
            // res.send(err);
            errorFunctions.findOtpError(req,res,err);
          })
        }).fail(function(err){
            errorFunctions.sendInternalServerError(req,res); 
        });

    }


    function logout(req,res){
      'use strict'
      var id  = req.body.userId;
      AccessTokenService.deleteRefreshTokenOnId(id)
      .then(function(succ){
        res.send({"succ": "logout"})
      },function(err){
        errorFunctions.sendInternalServerError(req,res);
      })
    }



    this.resourcePath = '/login';
    this.description = "Signup and Login module and reset Password and Otp Verifications";
    this.getMappings = function() {
        return {

            '/user': {
                '/login': {
                    post: {
                        callbacks: [login],
                        resource: 'Logininfo',
                        action: 'login',
                        summary: "signup with the FaD",
                        notes: "This method used to login into FaD application.",
                        type: "Object",
                        parameters: [
                            paramType.body("body", "Provide json object to Create", "login", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                '/logout': {
                    post: {
                        callbacks: [logout],
                        resource: 'logout',
                        action: 'logout',
                        summary: "signout with the FaD",
                        notes: "This method used to logout from the FaD application.",
                        type: "Object",
                        parameters: [
                            paramType.body("body", "Provide json object to Create", "logout", true)
                        ],
                        responseMessages: [{
                            "code": 400,
                            "message": "Invalid parameters"
                        }]
                    }
                },
                "/restePassword":{
                    post : {
                       callbacks: [restePassword],
                       resource: 'User',
                       action: 'restePassword',
                       summary: "restePassword",
                       notes: "This method rests passpord.",
                       type: "String",
                       parameters: [
                           paramType.body("body","Provide json object to Create","restePassword",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
                },
                "/forgotPassword":{
                    post : {
                       callbacks: [forgotPassword],
                       resource: 'User',
                       action: 'forgotPassword',
                       summary: "forgotPassword",
                       notes: "This method rests password for forgot.",
                       type: "String",
                       parameters: [
                           paramType.body("body","Provide json object to Create","forgotPassword",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
                },
                "/verifylogin":{
                    get : {
                       callbacks: [generateOtp],
                       resource: 'User',
                       action: 'generateOtp',
                       summary: "generateOtp for reseting password",
                       notes: "This method checks user",
                       type: "String",
                       parameters: [
                           paramType.query("username","provide the username","String",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
                },
                "/regenerateotponsignup":{
                    get : {
                       callbacks: [reGenerateOtponSIgnup],
                       resource: 'User',
                       action: 'reGenerateOtponSIgnup',
                       summary: "reGenerateOtponSIgnup",
                       notes: "This method regenerates otp",
                       type: "String",
                       parameters: [
                           paramType.query("username","provide the username","String",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
                },
                "/verifyOtp":{
                    post : {
                       callbacks: [verifyOtp],
                       resource: 'User',
                       action: 'verifyOtp',
                       summary: "verifyOtp",
                       notes: "This method checks user",
                       type: "String",
                       parameters: [
                           paramType.body("body","verify one time password","verifyOtp",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
                },
                "/verifyOtpOnSignup":{
                    post : {
                       callbacks: [verifyOtpOnSignUp],
                       resource: 'User',
                       action: 'verifyOtpOnSignup',
                       summary: "verifyOtpOnSignup",
                       notes: "This method checks user",
                       type: "String",
                       parameters: [
                           paramType.body("body","verify one time password","verifyOtpOnSignUp",true)
                       ],
                       responseMessages: [{
                           "code": 400,
                           "message": "Invalid parameters"
                       }]
                   }
                },
                "/validateToken":{
                    post : {
                       callbacks: [generateNewAccessToken],
                       resource: 'User',
                       action: 'generateNewAccessToken',
                       summary: "generate new access token",
                       notes: "This method generates new token",
                       type: "String",
                       parameters: [
                           paramType.body("body","provide the refreshtoken","refreshToken",true)
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
        return new LogininfoAPI();
    }
};
