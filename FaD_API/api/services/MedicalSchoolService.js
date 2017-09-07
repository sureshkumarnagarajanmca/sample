



/**
 * Created by narasimha on 03/10/17.
 */
var MedicalSchool = require('../../db/dbModels/MedicalSchools');

var Q = require('q');



exports.getList = function(){
    var deferred = Q.defer();

    MedicalSchool.find({}, function(err, medicalSchools) {
        if (medicalSchools) {
            deferred.resolve(medicalSchools);
        }else {
            deferred.reject("Error while retrieving the speciality list");
        }
    });
    return deferred.promise;
};

exports.getSearchedList = function(data, country,stateCode, cityName){
    var deferred = Q.defer();
    var data1 = new RegExp(data, "i");
    var stateData = new RegExp(stateCode, "i");
    var cityData = new RegExp(cityName, "i");
    var query = {};
    if(!!data){
        query['name'] = { $regex: data1 };
    }

    if(!!stateCode){
        query['address.state'] = { $regex: stateData };
    }

    if(!!cityName){
        query['address.city'] = { $regex: cityData };
    }
    if(!!country){
         query['address.country'] = { $regex: country };
    }

    console.log(query);
    // Hospital.find({'name' : { $regex: data1 }}).project({name : 1}).exec(function(err, hospitals) {
    //     console.log(hospitals);
    //     if (hospitals) {
    //         deferred.resolve(hospitals);
    //     }else {
    //         deferred.reject("Error while retrieving hospitals list");
    //     }
    // });
  console.log(query);

    MedicalSchool.aggregate({ $match : query}).limit(20).exec(function(err, medicalSchools) {
        // console.log(hospitals);
        if (medicalSchools) {
            deferred.resolve(medicalSchools);
        }else {
            deferred.reject("Error while retrieving hospitals list");
        }
    });
    return deferred.promise;
};

exports.getById = function(id){
     console.log("id : "+id);
    var deferred = Q.defer();
    MedicalSchool.findOne({'_id':id}, function(err, medicalSchool) {
        if(err) {
            deferred.reject("Error while retrieving the medicalSchool");
        }else {
            if (medicalSchool){
                deferred.resolve( medicalSchool );
            }else{
                deferred.resolve(null);
            }
        }

    });
    return deferred.promise;
};





this.medicalSchoolMap = function(data) {

    var medicalSchool = {};

//    medicalSchool._id  = require('mongoose').Types.ObjectId();
    medicalSchool.name = data.name.toUpperCase().trim();
    medicalSchool.address = {};
    medicalSchool.address.Line1StreetAddress = data.address.Line1StreetAddress;
    medicalSchool.address.Line2StreetAddress = data.address.Line2StreetAddress;
    medicalSchool.address.state = data.address.state;
    medicalSchool.address.country = data.address.country;
    medicalSchool.address.countyName = data.address.countyName;
    medicalSchool.address.city = data.address.city;
    
    medicalSchool.address.zipCode = data.address.zipCode || 0;
    for (var i in medicalSchool.address) {

        if (!medicalSchool.address[i]) {
            delete medicalSchool.address[i];
        }
    }

    return medicalSchool;
};

exports.create = function(data){
    var deferred = Q.defer();

    var medicalSchool = this.medicalSchoolMap(data);
    
     MedicalSchool.findOneAndUpdate({name:medicalSchool.name},{$set:medicalSchool},{upsert: true, new : true},function(err, result) {
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

exports.upload = function(data){
    var deferred = Q.defer();

    var medicalSchool = this.medicalSchoolMap(data);

    // console.log(hospital);
    MedicalSchool.findOneAndUpdate({name:medicalSchool.name},{$set:medicalSchool},{upsert: true, new : true},function(err, result) {
        // console.log(result)
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

exports.getCitiesList = function(country,state){
    var deferred = Q.defer();
    var query = {};
    var stateData = new RegExp(state, "i");
    var countryData = new RegExp(country, "i");
    if(!!state){
        query['address.state'] = { $regex: stateData };
    } 
     if(!!country){
       query['address.country'] = { $regex: countryData };
       }  
    console.log(query);
    MedicalSchool.find(query).distinct('address.city',function(err, result) {
        // console.log(result)
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}
   
exports.getStatesList = function(countryName){
    var deferred = Q.defer();
    var query = {};
    var countryData = new RegExp(countryName, "i");
    if(!!countryName){
        query['address.country'] = { $regex: countryData };
    }
    console.log(query);
    MedicalSchool.find(query).distinct('address.state',function(err, result) {
        // console.log(result)
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};


exports.update = function(id,data){
    var deferred = Q.defer();
    MedicalSchool.findOneAndUpdate({"_id":id},data, function(err, medicalSchool) {
        if (medicalSchool) {
            deferred.resolve(medicalSchool);
        }else {
            console.log(err);
            deferred.reject("Error while updating the  medical school");
        }
    });
    return deferred.promise;
};

