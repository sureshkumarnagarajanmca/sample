(function(){
	'use strict';

	// var expirationTime = 10*60*1000
		var expirationTime = 60*10*1000
	function generateOtp() {
		return {
			otp : Math.floor(100000 + Math.random() * 900000),
			expirationTime : expirationTime
		}
	}

	module.exports = {
		generateOtp : generateOtp
	}

})()
