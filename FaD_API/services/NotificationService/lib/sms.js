(function () {
	'use strict'
	var config = require('../../../config');
	
	var request = require('request');

	var Q = require('q');

	var	serverApi  =    'http://'+config.notifier.host+':'+config.notifier.port;
         console.log(serverApi);

	// var	serverApi  =    'http://10.0.90.107:3005';

	var smsNotification = {
		sendVerificationToken : sendVerificationToken,
		checkVerificationToken : checkVerificationToken,
		sendSms : sendSms
	}

	function checkVerificationToken(data){
		var deferred = Q.defer();
		var url = serverApi+'/checkToken';

		var payload = {
			"mobile" : data.mobile || 8885816567,
			"countryCode" : 91,
			"key" : data.otp
		}
		var options = {
			url : url,
			body : payload,
			json: true
		}
		request.post(options,function(err,res){
			if(err){
				deferred.reject(err);
			}else{
				if(res.body.hasOwnProperty("err")){
					deferred.reject(res.body);
				}else{
					deferred.resolve(res.body);					
				}
			}
		});
		return deferred.promise;
	}

	function sendVerificationToken(params){
		var deferred = Q.defer();
		var url = serverApi+'/sendToken';
		var payload = {
			"mobile" : params.mobile,
			"countryCode" : params.countryCode,
			"via" : "sms",
			"locale" : "en"
		}
		for(let k in payload){
			if (!payload[k]) {
				delete payload[k];
			};
		}
		var options = {
			url : url,
			body : payload,
			json: true
		}

		request.post(options,function(err,res){
			if(err){
				deferred.reject(err);
			}else{
				if(res.body.hasOwnProperty("err")){
					deferred.reject(res.body);
				}else{
					deferred.resolve(res.body);					
				}
			}
		});
		return deferred.promise;
	}

	function sendSms(params){
		console.log(params);
		var deferred = Q.defer();
		var url = serverApi+'/notify';
		var payload = {
			'mobile' : params.mobile,
			'countryCode' : params.countryCode || '+1' ,
			'message' : params.message
		}
		var options = {
			url : url,
			body : payload,
			json: true
		}
                request.post(options,function(err,res){
                  console.log(err,res)
                //      deferred.resolve();
                        if(err){
                               
                                deferred.reject(err);
                         }else  if(res.body.hasOwnProperty("err")){
                           deferred.reject(res.body);
                        } else{
                                deferred.resolve(res.body);

                         }
                 });
	
       	return deferred.promise;
	}

	module.exports = smsNotification;
})()
