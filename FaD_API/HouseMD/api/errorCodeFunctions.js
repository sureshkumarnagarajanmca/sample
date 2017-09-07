(function(){
    'use strict';
    function sendInternalServerError(req,res,error){
        res.status(500);
        if(!!error){
            if(error.message.indexOf('Cast to ObjectId failed for value') > -1){
                res.send({"errCode" : "INVLD USER ID"});
            }else{
                res.send({"errCode" : "INTERNAL"});
            }
        }else{
            res.send({"errCode" : "INTERNAL"});
        }
        
    }

    function userNotFoundError(req,res){
        res.status(404);
        res.send({"errCode" : "USRNTFND"});
    }

    function incorrectOtp(req,res){
        res.status(401);
        res.send({"errCode" : "INCRCTOTP"});
    }


    function findOtpError(req,res,err){
        console.log(err);
        if(err.errCode === 'INCRCTOTP'){
            incorrectOtp(req,res)
        }else if(err.errCode === 'NOPNDGOTPVRF'){
            noOtpVerificationPending(req,res)
        }else if(err.errCode === 'OTPEXPIRED'){
            expiredOtp(req,res)
        }else{
            sendInternalServerError(req,res,err);
        }
    }

    function noOtpVerificationPending(req,res){
        console.log("ASd")
        res.status(401);
        res.send({"errCode" : "NOPNDGOTPVRF"});
    }

    function incorrectPassword(req,res){
        res.status(401);
        res.send({"errCode" : "PWDWRG"});   
    }

    function expiredAccesToken(req,res){
        res.status(401);
        res.send({"errCode" : "EXPRDACCESSTOKEN"});   
    }

    function wrongAccessToken(req,res){
        res.status(401);
        res.send({"errCode" : "WRGACCESSTOKEN"});   
    }

    function noAccessToken(req,res){
        res.status(401);
        res.send({"errCode" : "NOACCESSTOKEN"});   
    }

    function invalidRefreshToken(req,res){
        res.status(401);
        res.send({"errCode" : "INVALIDREFRSHTOKN"});   
    }

    function expiredOtp(req,res){
        res.status(401);
        res.send({"errCode" : "OTPEXPIRED"});    
    }

    module.exports = {
    	sendInternalServerError : sendInternalServerError,
    	userNotFoundError : userNotFoundError,
        incorrectOtp : incorrectOtp,
        noOtpVerificationPending: noOtpVerificationPending,
        incorrectPassword: incorrectPassword,
        expiredAccesToken: expiredAccesToken,
        wrongAccessToken : wrongAccessToken,
        noAccessToken : noAccessToken,
        invalidRefreshToken : invalidRefreshToken,
        findOtpError : findOtpError,
        expiredOtp : expiredOtp
    }

})()