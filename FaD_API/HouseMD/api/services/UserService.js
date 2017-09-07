var User = require('../../db/dbModels/Users');
//bcrypt = require('bcrypt');
var moment = require('moment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Q = require('q');

exports.findUserByQuery = function(query){
    var deferred = Q.defer();

    User.find(query, function(error, users) {
        if (users) {
            deferred.resolve(users);
        }else {
            if(error){
                deferred.reject("Error while finding the user");
            }else{
                deferred.reject("user not found");
            }

        }
    });
    return deferred.promise;
};

exports.getUsersList = function(){
    var deferred = Q.defer();
    User.find({},{'password':0}, function(err, users) {
        if (users) {
            deferred.resolve(users);
        }else {
            deferred.reject("Error while retrieving the users list");
        }
    });
    return deferred.promise;
};

exports.getUserById = function(id){
    var deferred = Q.defer();
    User.findOne({'_id':id}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
                deferred.reject("Error while finding the user");
            }else{
                deferred.resolve(null);
            }
        }
    });
    return deferred.promise;
};

exports.getUserByEmail = function(email){
    var deferred = Q.defer();
    User.findOne({email:email}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
                deferred.reject("Error while finding the user");
            }else{
                deferred.reject("user not found");
            }
        }
    });
    return deferred.promise;
};


// this.createUserMap = function(data) {
//     var user = {};
//         user.email = data.email;
//         user.mobile = data.mobile;
//         user.fName  = data.fName;
//         user.lName   = data.lName;
//         user.type       = data.type;
//         if(data.dob){
//             user.dob =  moment(data.dob,'YYYY-MM-DD').toISOString();
//         }
//         user.gender = data.gender;
//         user.imageId = data.imageId;
//         for(i in user){
//             if(!user[i]){
//                 delete user[i];
//             }
//         }
//     return user;
// };

this.createUserMap = function(data) {
    var user = {};
    user.email = data.username;
    user.mobile = data.mobile;
    user.fName = data.fName;
    user.lName = data.lName;
    user.countryCode = data.countryCode;
    user.type = data.type;
    user.deviceId = data.deviceId;

    if(data.dob){
        user.dob =  moment(parseInt(data.dob))*1;
    }
    user.gender = data.gender;
    user.imageId = data.imageId;
    for(i in user){
        if(!user[i]){
            delete user[i];
        }
    }
    return user;
};

// this.createDoctorMaponUpload = function(data){

// }

exports.createUser = function(data){
    var deferred = Q.defer();
    var user;
    if(data.type === 'doctor'){
        user = createDoctorMap(JSON.parse(JSON.stringify(data)));
    }else{
        user = this.createUserMap(JSON.parse(JSON.stringify(data)));
    }
    User.create(user, function(err, user) {
        if (user) {
            data.userId = user._id;
            deferred.resolve(data);
        }else {
            console.log(err);
            deferred.reject({'error':err.message});
        }
    });
    return deferred.promise;
};

function createDoctorMap (data) {
     var user = {};
        user.email = data.username;
        user.mobile = data.mobile;
        user.type       = data.type;
    for(i in user){
        if(!user[i]){
            delete user[i];
        }
    }
    return user
}

this.createDoctorMaponUpload = function (data) {
     var user = {};
        user.email = data.npi;
        user.mobile = data.npi;
        // user.npi = data.npi;
        user.type       = data.type;
    for(i in user){
        if(!user[i]){
            delete user[i];
        }
    }
    return user;
}

exports.createDoctorOnUpload = function(data){
    var deferred = Q.defer();
    var user = this.createDoctorMaponUpload(data);
    User.create(user, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            console.log(err);
            deferred.reject({'error':err.message});
        }
    });
    return deferred.promise;
};


exports.updateUser = function(id,data){
    var deferred = Q.defer();
    var user = this.createUserMap(JSON.parse(JSON.stringify(data)));
    User.findOneAndUpdate({"_id":id},{$set : user},{new: true}, function(err, user) {
        if (err) {
            deferred.reject("Error while updating the doctor");
        }else {
            if(!!user){
                // deferred.resolve({
                //     messageCode : "UPDATE SUCCESS",
                //     message : "Update SuccessFull"
                // });
                deferred.resolve(user);
            }else{
                deferred.error({
                    errorCode : "NOUSER",
                    message : "User Not found"
                });
            }
        }
    });
    return deferred.promise;
};

// exports.getUserById = function(id){
//     var deferred = Q.defer();
//     User.findOne({"userId":id},function(err, user) {
//         if (user) {
//             deferred.resolve(user);
//         }else {
//             deferred.reject("Error while updating the user");
//         }
//     });
//     return deferred.promise;
// }

exports.deleteUser = function(id){
    var deferred = Q.defer();
    User.remove({ '_id' : id }, function(err,data) {
        if (data) {
            deferred.resolve(data);
        }else {
            deferred.reject("Error while deleting the user");
        }
    });
    return deferred.promise;
};

function userMailAndMobileUpdate(data){
    var user = {}
    user.email = data.username;
    user.mobile = data.mobile;
    user.countryCode = data.countryCode;
    return user;
}
exports.updateUserMailAndMobile = function(userId,data){
    var deferred = Q.defer();

    var user = userMailAndMobileUpdate(data);
    User.findOneAndUpdate({"_id":userId},{$set : user},function(err, user) {
        if (err) {
            deferred.reject("Error while updating the doctor");
        }else {
            if(!!user){
                // deferred.resolve({
                //     messageCode : "UPDATE SUCCESS",
                //     message : "Update SuccessFull"
                // });
                deferred.resolve(user);
            }else{
                deferred.reject({
                    errorCode : "NOUSER",
                    message : "User Not found"
                });
            }
        }
    });
    return deferred.promise;
}

exports.userLogin = function(username, password){
    var deferred = Q.defer();
    User.find({"username":username, "password":password}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            deferred.reject("Error while authenticating the user");
        }
    });
    return deferred.promise;
};

exports.createNewUserForDoctor = function(data){
    'use strict';
    var deferred = Q.defer();
    var user;
    var payload = {
        _id : data.userId,
        mobile : data.mobile,
        email : data.username,
        npi : data.npi,
        type : data.type,
        countryCode : data.countryCode,
        deviceId : data.deviceId
    }

    for (let key in payload) {
        if(!payload[key]){
            delete payload[key];
        }
    };
    console.log(payload);
    User.create(payload, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            console.log(err);
            deferred.reject({'error':err.message});
        }
    });
    return deferred.promise;
}

exports.checkmobile = function (mobile){
    'use strict';
    var deferred = Q.defer();
    console.log(mobile);
    User.findOne({mobile : mobile}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(false);
            }
        }
    });
    return deferred.promise;   
}
