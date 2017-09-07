(function(){
	'use strict';
	var SANDBOX_APIKEY = '36cfe745b497f8b55c8377971b75f7b7';
	var PRODAPI_KEY = 'UTA7nYl3Ei3N1YYFYSA1UHG9NByI9LHM';
	var Q = require('q');

	// var authy = require('authy')(SANDBOX_APIKEY, 'http://sandbox-api.authy.com');
	// var authy = require('authy')(SANDBOX_APIKEY, 'http://sandbox-api.authy.com');
	var authy = require('authy')(PRODAPI_KEY);
	var request = require('request');
	var rp = require('request-promise');
	var AuthenticationService = {
		checkVerificationCode : checkVerificationCode,
		sendVerificationCode : sendVerificationCode
	}

	// console.log(authy);
	function checkVerificationCode(data){
		var deferred = Q.defer();

		if(!!data.mobile){
			authy.phones().verification_check(data.mobile, data.countryCode, data.key, function(err, res) {
		    	if(err){
		    		deferred.reject(err);
		    	}else{
		    		if(!!res.success){
		    			deferred.resolve(true);
		    		}else{
		    			deferred.reject("Wrong Token");
		    		}
		    	}
			});
		}else{
			deferred.reject("MobileNumber not available");
		}
		return deferred.promise;
	}

	function sendVerificationCode(data){
		var deferred = Q.defer();
		if(!!data.mobile){
			var params = {}
			params.via = data.via;
			params.locale = data.locale;
			authy.phones().verification_start(data.mobile, data.countryCode, params , function(err, res) {
				// console.log(res,err)
		    	if(err){
		    		deferred.reject(err);
		    	}else{
		    		if(!!res.success){
		    			deferred.resolve(true);
		    		}else{
		    			deferred.reject("Wrong Token");
		    		}
		    	}
			});			
		}else{
			deferred.reject("MobileNumber not available");
		}
		return deferred.promise;
	}

// authy.phones().verification_check(8885816567, 91, 8708 , function(err, res) {
// 	console.log(err,res);
// });	
	//  var params = {
 //    	'via' : 'sms',
 //    	locale : 'en'
 //    }	
 //    authy.phones().verification_start(8885816567, 91,params , function(err, res) {
 //    	console.log(err,res);
	// });

	module.exports = AuthenticationService;

})()
