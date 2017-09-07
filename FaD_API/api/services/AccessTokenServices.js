(function () {
    'use strict'
    var accessToken = require('../../db/dbModels/AccessToken');
    //bcrypt = require('bcrypt');
    var moment = require('moment');
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Q = require('q');


    var accessTokenServices = {
        deleteRefreshTokenOnId  : deleteRefreshTokenOnId,
        addrefreshToken : addrefreshToken
    }

    
    function deleteRefreshTokenOnId(userId){
    	var deferred = Q.defer();
    	accessToken.findOne({userId : userId},function(err,succ){
    		if(err){
    			deferred.reject(err);
    		}else{
    			console.log(succ);
    			deferred.resolve(succ)
    		}
    	})
        return deferred.promise;
    }

    function addrefreshToken(userId,obj){
        var deferred = Q.defer();
        accessToken.findOneAndUpdate({userId : obj.userId},{$set : obj},{upsert : true , new : true},function (err,succToken) {
            if(err){
                deferred.reject({"succ" : err})
            }else{
                deferred.resolve()
            }
        });
        return deferred.promise;
    }    

    module.exports = accessTokenServices;


})()


