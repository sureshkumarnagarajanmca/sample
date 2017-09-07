(function () {
    'use strict'
    var otpModel = require('../../db/dbModels/otp.model');
    //bcrypt = require('bcrypt');
    var moment = require('moment');
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Q = require('q');

    var otpGeneration = require('../../services/generateOtpService');

    var otpServices = {
        generateOtp  : generateOtp,
        createAndSaveOtpForUsedId : createAndSaveOtpForUsedId,
        verifyOtpByUserId : verifyOtpByUserId
    }

    function generateOtp (){
        return otpGeneration.generateOtp();
    }

    function createAndSaveOtpForUsedId (id){
       var deferred = Q.defer();
        var otp = generateOtp();
        //var otp = { otp: 666666, expirationTime: 600000 }
       var otpData =  otpMapping(otp,id);
       otpModel.findOne({userId : otpData.userId},function(err,succData){
            if(err){
                deferred.reject(err);
            }else if(!succData){
                // create and generate and otp
                otpModel.create(otpData,function(err,otpGenSucc){
                    if(err){
                        deferred.reject(err);
                    }else{
                        if(!!otpGenSucc){
                            otpGenSucc = otpGenSucc.toObject();
                            deferred.resolve(otpGenSucc.otp);
                        }else{
                             deferred.reject(otpGenSucc);
                        }
                    }
                })
            }else{
                succData = succData.toObject();
                if(moment()*1 >= succData.expiry){
                    // creatingnew otp on expiration of existing otp
                    otpModel.findOneAndUpdate({userId : otpData.userId},{$set : otpData},
                        {upsert : true, new : true},function(err,otpGenSucc){
                    if(err){
                        deferred.reject(err);
                    }else{
                            if(!!otpGenSucc){
                                otpGenSucc = otpGenSucc.toObject();
                                deferred.resolve(otpGenSucc.otp);
                            }else{
                                 deferred.reject(otpGenSucc);
                            }
                        }
                    });
                }else{
                    deferred.resolve(succData.otp);
                }
            }
       })
        return deferred.promise; 
    } 

    function verifyOtpByUserId(id,otp){
         console.log("Asdasd")
        var deferred = Q.defer();
        otpModel.findOne({userId : id},function(err,succOtp){
            if(err){
                deferred.reject(err);
            }else{
                if(succOtp){
                    succOtp = succOtp.toObject();
                    if(succOtp.otp === otp){
                        if(succOtp.expiry <= moment()*1){
                            deferred.reject({errCode : 'OTPEXPIRED'})
                        }else{

                            // validation otp and deleting the otp
                            otpModel.findOneAndRemove({userId : id},function(err,succ){
                                if(err){
                                    deferred.reject(err)  
                                }else{
                                    deferred.resolve({userId : id})  
                                }
                            })
                            // deferred.resolve({userId : id})                            
                        }
                    }else{
                        deferred.reject({errCode : 'INCRCTOTP'});
                        
                    }
                }else{
                    // no otp to verify for this user
                    deferred.reject({errCode : 'NOPNDGOTPVRF'});
                }
            }
        });
        return deferred.promise;
    }


    function otpMapping(data,id){
        var otp = {};
        otp.userId = id || "test2";
        otp.otp = data.otp.toString();
        otp.expiry = moment()*1+data.expirationTime;
        // otp.otpType = otp.otpType;
        for(var i in otp){
            if(!otp[i]){
                delete otp[i];
            }
        }
        return otp;
    }

    module.exports = otpServices;


})()


