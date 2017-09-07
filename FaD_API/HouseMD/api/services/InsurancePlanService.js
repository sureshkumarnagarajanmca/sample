/**
 * Created by pradeep on 3/18/16.
 */
var InsurancePlan = require('../../db/dbModels/InsurancePlans');
var InsuranceProviderService = require('./InsuranceProviderService');

var Q = require('q');



exports.getList = function(){
    var deferred = Q.defer();

    InsurancePlan.find({},{}, function(err, insurancePlan) {
        if (insurancePlan) {
            deferred.resolve(insurancePlan);
        }else {
            deferred.reject("Error while retrieving the plans list");
        }
    });
    return deferred.promise;
};

exports.getById = function(id){
    var deferred = Q.defer();
    InsurancePlan.findOne({'_id':id}, function(err, insurancePlan) {
        if (insurancePlan) {
            deferred.resolve(insurancePlan);
        }else {
            deferred.reject("Error while retrieving the plan");
        }
    });
    return deferred.promise;
};

exports.getByProviderId = function(id){
    var deferred = Q.defer();
    InsurancePlan.find({'providerId':id}, function(err, planslist) {
        // console.log(err,planslist);
        if (err) {
            deferred.reject("Error while retrieving the plan");
        }else {
            deferred.resolve(planslist);
        }
    });
    return deferred.promise;
};



 // InsurancePlan.findOne({}, function(err, planslist) {
 //    console.log(err,planslist);
 //    });
/*exports.getByProviderName = function(providerName){
    var deferred = Q.defer();

    InsurancePlan.findOne({'providerId':idproviderName}, function(err, insurancePlan) {
        if (insurancePlan) {
            deferred.resolve(insurancePlan);
        }else {
            deferred.reject("Error while retrieving the organization");
        }
    });
    return deferred.promise;
};*/


this.createInsurancePlanMap = function(data) {

    var insurancePlan = {};
    insurancePlan.providerId = data.providerId;
    insurancePlan.name = data.name;

    if(data.category)
        insurancePlan.category = data.category;

    if(data.status)
        insurancePlan.status = data.status;

    return insurancePlan;
};

exports.create = function(data){
    var deferred = Q.defer();
    /*if(data.providerId){

    }*/


   /* InsuranceProviderService.getById(id).then(function(data){
            //res.send(data);
    })
    .fail(function(err){
            res.send(err);
    });*/
    var insurancePlan = this.createInsurancePlanMap(data);

    InsurancePlan.create(insurancePlan, function(err, result) {
        if (result) {
            deferred.resolve(result);
        }else {
            deferred.reject({'error':err.message});
        }
    });
    return deferred.promise;
};


exports.update = function(id,data){
    var deferred = Q.defer();
    InsurancePlan.findOneAndUpdate({"_id":id},data, function(err, insurancePlan) {
        if (user) {
            deferred.resolve(insurancePlan);
        }else {
            deferred.reject("Error while updating the plan");
        }
    });
    return deferred.promise;
};