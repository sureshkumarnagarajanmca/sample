(function () {
    'use strict'
    var certificationsCollection = require('../../db/dbModels/certifications');
    //bcrypt = require('bcrypt');
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Q = require('q');


    var CertificationsServices = {
        uploadCertifications  : uploadCertifications,
        getAllCertificationsList : getAllCertificationsList,
        searchCertifications : searchCertifications
    }

    
    function uploadCertifications(certification){
        var deferred = Q.defer();
        // var certificationObj = certification;
        var certificationObj = certificationMapping(certification);
        certificationsCollection.findOneAndUpdate({certficationName : certificationObj.certficationName},{$set  : certificationObj},{upsert : true, new : true}
        	,function(err,succ){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(succ);
            }
        })
        return deferred.promise;
    }

    function certificationMapping(certification){
        console.log("******** certification obj");
        console.log(certification);
        var data = {}

        data.certificationId = certification._id;        
        data.certficationName  = certification.name;
        data.specialities = [{}];
        data.specialities[0].taxonomyCode = certification.specialities[0].taxonomyCode;
        data.specialities[0].taxonomyString = certification.specialities[0].taxonomyString;
        return data;
    }

    function searchCertifications(searchtext){
    	var deferred = Q.defer();
	    var data1 = new RegExp(searchtext, "i");
	    var query = {};
	    if(!!searchtext){
	        query['certficationName'] = { $regex: data1 };
	    }
	    certificationsCollection.aggregate({ $match : query}).exec(function(err, certifications) {
	        // console.log(hospitals);
	        if (certifications) {
	            deferred.resolve(certifications);
	        }else {
	            deferred.reject("Error while retrieving hospitals list");
	        }
	    });
	    return deferred.promise;
    }

    function getAllCertificationsList(){
    	var deferred = Q.defer();
        certificationsCollection.find({},function(err,succ){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(succ);
            }
        })
        return deferred.promise;
    }

    module.exports = CertificationsServices;


})()


