/**
 * Created by pradeep on 4/27/16.
 */
var Hospital = require('../../db/dbModels/Hospitals');

var Q = require('q');



exports.getList = function(){
    var deferred = Q.defer();

    Hospital.find({}, function(err, hospitals) {
        if (hospitals) {
            deferred.resolve(hospitals);
        }else {
            deferred.reject("Error while retrieving the speciality list");
        }
    });
    return deferred.promise;
};

exports.getSearchedList = function(data, stateCode, cityName){
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
            query['address.country'] = { $regex :"US"};
    console.log(query);
    // Hospital.find({'name' : { $regex: data1 }}).project({name : 1}).exec(function(err, hospitals) {
    //     console.log(hospitals);
    //     if (hospitals) {
    //         deferred.resolve(hospitals);
    //     }else {
    //         deferred.reject("Error while retrieving hospitals list");
    //     }
    // });


    Hospital.aggregate({ $match : query}).limit(20).exec(function(err, hospitals) {
        // console.log(hospitals);
        if (hospitals) {
            deferred.resolve(hospitals);
        }else {
            deferred.reject("Error while retrieving hospitals list");
        }
    });
    return deferred.promise;
};

exports.getById = function(id){
    var deferred = Q.defer();
    Hospital.findOne({'_id':id}, function(err, hospital) {
        if(err) {
            deferred.reject("Error while retrieving the hospital");
        }else {
             console.log("id "+ id);
             console.log(hospital);
            if (hospital){
                deferred.resolve(hospital);
            }else{
                deferred.resolve(null);
            }
        }

    });
    return deferred.promise;
};





this.hospitalMap = function(data) {

    var hospital = {};

    // hospital.medicareCCN = data.medicareCCN;
     //hospital._id = MO  //NOTHING CREATED HERE . NEED TO CALRIFY WITH TEAM
    //  hospital._id  = require('mongoose').Types.ObjectId();
/*    if(!data.orgName){
      if(!!data.name){
       data.orgName = data.name;
     }
   }*/
    hospital.name = data.name.toUpperCase().trim();
    hospital.address = {};
    data.address = data.address||{};
    hospital.address.Line1StreetAddress = data.address.Line1StreetAddress|| " ";
    hospital.address.Line2StreetAddress = data.address.Line2StreetAddress || " ";
    hospital.address.state = data.address.state || " ";
    hospital.address.country = data.address.country || " ";
    hospital.address.countyName = data.address.countyName || " ";
    hospital.address.city = data.address.city || " ";
    hospital.address.phoneNo = data.address.phoneNo || " ";
    hospital.address.zipCode = data.address.zipCode || 0;
    // hospital.rating = data.rating;



    console.log(hospital.name)

    for (var i in hospital.address) {

        if (!hospital.address[i]) {
            delete hospital.address[i];
        }
    }
    
    return hospital;
};

exports.create = function(data){
    var deferred = Q.defer();
    var hospital = this.hospitalMap(data);
     Hospital.findOneAndUpdate({name:hospital.name},{$set:hospital},{upsert: true, new : true},function(err, result) {
        // console.log(result)
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

    var hospital = this.hospitalMap(data);
    console.log(hospital);
    Hospital.findOneAndUpdate({name:hospital.name},{$set:hospital},{upsert: true, new : true},function(err, result) {
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

exports.getCitiesList = function(stateCode){
    var deferred = Q.defer();
    var query = {};
    var stateData = new RegExp(stateCode, "i");
    if(!!stateCode){
        query['address.state'] = { $regex: stateData };
    }
    Hospital.find(query).distinct('address.city',function(err, result) {
        if (err) {
            deferred.reject({'error':err.message});
        }else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

exports.update = function(id,data){
    var deferred = Q.defer();
    Hospital.findOneAndUpdate({"_id":id},data, function(err, hospital) {
        if (hospital) {
            deferred.resolve(hospital);
        }else {
            console.log(err);
            deferred.reject("Error while updating the hospital");
        }
    });
    return deferred.promise;
};


 
exports.getHospitalMapping = function(HospitalArr){
 var that = this;
  function getHospitalIds(name,callback){
   
    name = name.toUpperCase();
    Hospital.findOne({name:name} ,function(err,result){
       if(!err && !!result ){
          console.log(result);
          return callback(null,{"hospitalName" : result.name,"hospitalId" : result._id  });
         }
       else {
         

          var data = {name:name};
          var hospital = that.hospitalMap(data);
          Hospital.findOneAndUpdate({name:hospital.name},{$set:hospital},{upsert: true, new : true},function(err, result) {
          if (err) {
              return callback(null,null);

        }
        else {
              return callback(null,{"hospitalName" : result.name,"hospitalId" : result._id  });
        }
    });

       }

    });
  
}
var async = require('async');
var q = require('q')
var defer = q.defer();
console.log(defer);
async.mapSeries(HospitalArr,  getHospitalIds , function(err,result){
     if(!err){
        
         defer.resolve(result);
       }
     else{
      console.log(err);
      defer.resolve(err);
     }
      });
   return defer.promise
}
