/**
 * Created by pradeep on 3/17/16.
 */
var mongoose = require('mongoose');
var InsuranceProvider = require('../../db/dbModels/InsuranceProviders');
// var ObjectId = mongoose.Types.ObjectId;

var Q = require('q');



// exports.getList = function(){
//     var deferred = Q.defer();
//     InsuranceProvider.find({}).sort({popular : -1,'name':1}).exec(function(err, insuranceProvider) {
//         if (insuranceProvider) {
//             deferred.resolve(insuranceProvider);
//         }else {
//             deferred.reject("Error while retrieving the insuranceProvider list");
//         }
//     });
//     return deferred.promise;
// };

exports.getPopularInsuranceList = function(){
    var deferred = Q.defer();
    var qurey = {};
    qurey.popular = { $gt: 0 };
    InsuranceProvider.find(qurey).sort({'name':1}).exec(function(err, insuranceProvider) {
        if (insuranceProvider) {
            deferred.resolve(insuranceProvider);
        }else {
            deferred.reject("Error while retrieving the insuranceProvider list");
        }
    });
    return deferred.promise;
};

exports.getRegularInsuranceList = function(){
    var deferred = Q.defer();
    // var qurey = {};
    // qurey.popular = { $lt: 1 };
    InsuranceProvider.find({popular : {$exists : false}}).sort({'name':1}).exec(function(err, insuranceProvider) {
        if (insuranceProvider) {
            deferred.resolve(insuranceProvider);
        }else {
            deferred.reject("Error while retrieving the insuranceProvider list");
        }
    });
    return deferred.promise;
};

exports.getById = function(id){
    var deferred = Q.defer();
    InsuranceProvider.findOne({'_id':id}, function(err, insuranceProvider) {
        if (insuranceProvider) {
            deferred.resolve(insuranceProvider);
        }else {
            deferred.reject("Error while retrieving the provider");
        }
    });
    return deferred.promise;
};


this.createInsuranceProviderMap = function(data) {
'use strict'
    var insuranceProvider = {};
        insuranceProvider.name = data.name;
        insuranceProvider._id = data._id;
        insuranceProvider.payerId = data.payerId;
        insuranceProvider.popular = data.popular;
    for(let key in insuranceProvider){
        if(!insuranceProvider[key]){
            delete insuranceProvider[key];
        }
    }
    return insuranceProvider;
};

exports.addInsurance = function(data){
    var deferred = Q.defer();
    var insuranceProvider = this.createInsuranceProviderMap(data);
    InsuranceProvider.findOneAndUpdate({name:insuranceProvider.name},{$set : insuranceProvider},{upsert: true},function(err, insuranceProvider) {
        if (insuranceProvider) {
            deferred.resolve(insuranceProvider);
        }else {
            deferred.reject({'error':err});
        }
    });
    return deferred.promise;
};


exports.update = function(id,data){
    var deferred = Q.defer();
    InsuranceProvider.findOneAndUpdate({"_id":id},data, function(err, insuranceProvider) {
        if (insuranceProvider) {
            deferred.resolve(insuranceProvider);
        }else {
            deferred.reject("Error while updating the insuranceProvider");
        }
    });
    return deferred.promise;
};