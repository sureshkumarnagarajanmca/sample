/**
 * Created by pradeep on 3/8/16.
 */
var Logininfo = require('../../db/dbModels/Logininfo');

var Q = require('q');

exports.getLogininfoByQuery = function(query){
    var deferred = Q.defer();

    Logininfo.find(query, function(error, logininfo) {
        if (logininfo) {
            deferred.resolve(logininfo);
        }else {
            deferred.reject("Error while finding the organization");
        }
    });
    return deferred.promise;
};

exports.getLoginsList = function(){
    var deferred = Q.defer();

    Logininfo.find({},{}, function(err, logininfolist) {
        if (logininfolist) {
            deferred.resolve(logininfolist);
        }else {
            deferred.reject("Error while retrieving the organizations list");
        }
    });
    return deferred.promise;
};

exports.getLogininfoById = function(id){
    var deferred = Q.defer();
    Logininfo.findOne({'_id':id}, function(err, logininfo) {
        if (logininfo) {
            deferred.resolve(logininfo);
        }else {
            deferred.reject("Error while retrieving the organization");
        }
    });
    return deferred.promise;
}
            // logininfo.source = data.source || "FaD";
            // logininfo.mobileVerifiedInd = false;
            // logininfo.emailVerifiedInd = false;
            // logininfo.profVerfInd = false;


this.createLoginMap = function(data) {
    var logininfo = {};
    logininfo.login     = data.login;
    if(data.source)
        logininfo.source    = data.source|| "FaD";;
    logininfo.userId    = data.userId;
    logininfo.pwdhash   = data.pwdhash;
    logininfo.mobileVerfiInd   = data.mobileVerifiedInd || false;
    logininfo.eMailVerfInd   = data.emailVerifiedInd || false;
    logininfo.mobile = data.mobile;
    logininfo.countryCode = data.countryCode;
    logininfo.profVerfInd = false;
    return logininfo;
};

// exports.createLogin = function(data){
//     var deferred = Q.defer();
//     var logininfo = this.createLoginMap(data);
//     Logininfo.create(logininfo, function(err, result) {
//         console.log(result);
//         if (result) {
//             deferred.resolve(result);
//         }else {
//             deferred.reject({'error':err.message});
//         }
//     });
// console.log(logininfo);
//     // Logininfo.findOneAndUpdate({userId: data.userId},{$set : logininfo},{new : true}
//     // ,function(err, result) {
//     //     if(err){
//     //         deferred.reject(err);
//     //     }else{
//     //         if(result){
//     //             deferred.resolve(result);
//     //         }else{
//     //             deferred.resolve(result);
//     //         }
//     //     }
//     // });
//     return deferred.promise;
// };
exports.createLogin = function(data){
    var deferred = Q.defer();
    var logininfo = this.createLoginMap(data);
    Logininfo.findOneAndUpdate({userId : data.userId},{$set :logininfo}, {new : true, upsert : true}
    ,function(err, result) {
        console.log(result);
        if (result) {
            deferred.resolve(result);
        }else {
            if(err){
                deferred.reject({'error':err.message});
            }else{
                deferred.resolve(result);
            }
        }
    });

    return deferred.promise;
};

exports.userLogin = function(username, password){
    var deferred = Q.defer();
    Logininfo.findOne({"login":username, "pwdhash":password}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            deferred.reject("Error while authenticating the user");
        }
    });
    return deferred.promise;
};

exports.userLoggingin = function(username, password){
    var deferred = Q.defer();
    Logininfo.findOne({"login":username, "pwdhash":password}, function(err, user) {
        if (user) {
            deferred.resolve({userId : user.userId});
        }else {
            if(err){
                deferred.reject("Error while authenticating the user");
            }else{
                deferred.reject("User Not found");
            }
            
        }
    });
    return deferred.promise;
};

exports.verifyEmail = function(email) {
     var deferred = Q.defer();
     Logininfo.findOne({"login":email}, function(err, user) {
         if (user) {
             deferred.resolve(user);
         }else {
             deferred.reject("Error while authenticating the user");
         }
     });
     return deferred.promise;
};

exports.checkEmail = function(email){
    var deferred = Q.defer();
    Logininfo.findOne({"login":email}, function(err, user) {
         if(err){
            deferred.reject(err);
         }else{
            if(!!user){
                deferred.resolve(user);
            }else{
                deferred.resolve(false);
            }
         }
    });
    return deferred.promise;
}

exports.checkEmailObVerifiedIndicationOfMobile = function(email){
    var deferred = Q.defer();
    Logininfo.findOne({"login":email}, function(err, user) {
         if(err){
            deferred.reject(err);
         }else{
            if(!!user){
                if(!!user.mobileVerfiInd){
                    deferred.resolve(user);
                }else{
                    // mobile not verified for user
                    deferred.resolve(false);
                }
            }else{
                deferred.resolve(false);
            }
         }
    });
    return deferred.promise;
}

exports.verifyMobile = function(mobile) {
    var deferred = Q.defer();
    Logininfo.findOne({"login":mobile}, function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            deferred.reject("Error while authenticating the user");
        }
    });
    return deferred.promise;
};

exports.resetpassword = function(userId,password){
    var deferred = Q.defer();
    Logininfo.findOneAndUpdate({"userId":userId}, {$set : { pwdhash : password}},function(err, user) {
        if (user) {
            deferred.resolve({"succ" : "succ"});
        }else {
            if(!user){
                deferred.reject({
                    errorCode : 500,
                    errorMessage : "ERRUSERNOTFOUND"
                });
            }else{
               deferred.reject({
                    errorCode : 500,
                    errorMessage : "INTERNALSERVERERROR"
                });
            }
            
        }
    });
    return deferred.promise;
}

exports.generateOtp  = function(username){
    var deferred = Q.defer();
    Logininfo.findOne({"login":username},function(err, user) {
        if (user) {
            deferred.resolve({ userId : user.userId});
        }else {
            if(!user){
                deferred.reject({
                    errorCode : 500,
                    errorMessage : "ERRUSERNOTFOUND"
                });
            }else{
                 deferred.reject({
                    errorCode : 500,
                    errorMessage : "INTERNALSERVERERROR"
                });
            }
            
        }
    });
    return deferred.promise;
}

exports.getUserByLogin  = function(username){
    var deferred = Q.defer();
    Logininfo.findOne({"login":username},function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(user)
            }
        }
    });
    return deferred.promise;
}

exports.getUserByUserId = function(userId){
   var deferred = Q.defer();
    Logininfo.findOne({"userId":userId},function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.reject(user)
            }
        }
    });
    return deferred.promise; 
}

exports.getUserByUserIdOnProfileVerfInd = function(userId){
   var deferred = Q.defer();
    Logininfo.findOne({"userId":userId,'profVerfInd' : true},function(err, user) {
        // console.log(err,userId)
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.reject(user)
            }
        }
    });
    return deferred.promise; 
}

exports.checkLogin = function(userId){
    var deferred = Q.defer();
    Logininfo.findOne({"userId":userId}, function(err, user) {
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(user);
        }
    });
    return deferred.promise;
}


exports.getUserByLoginOnEmailOrMobile  = function(username){
    var deferred = Q.defer();
    Logininfo.findOne({ $or :  [{"login":username},{"mobile":username}]},function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(user)
            }
        }
    });
    return deferred.promise;
}

exports.getUserByLoginOnEmailOrMobileAndPwdOnProfileVerfInd = function(username,password){
    var deferred = Q.defer();
    Logininfo.findOne({$and : [{ $or :  [{"login":username},{"mobile":username}]},{"pwdhash" : password},{"profVerfInd" : true}]}
        ,function(err, user) {
        if (user) {
            deferred.resolve(user);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(user)
            }
        }
    });
    return deferred.promise;
}


exports.checkEmailOnProfileVerifiedInd = function(email){
    var deferred = Q.defer();
    // true if email is found and valid false if not found or not valid
    Logininfo.findOne({"login":email,"profVerfInd" : true},function(err, user) {
        if (user) {
            deferred.resolve(true);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(false)
            }
        }
    });
    return deferred.promise;
}

exports.getUserByLoginOnEmailOrMobileOnProfileVerfInd = function(username){
    var deferred = Q.defer();
    Logininfo.findOne({$and : [{ $or :  [{"login":username},{"mobile":username}]},{"profVerfInd" : true}]}
        ,function(err, user) {
        if (user) {
            // user = user.toObjetc();
            deferred.resolve(user);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(user)
            }
        }
    });
    return deferred.promise;
}

exports.checkMobileOnProfileVerifiedInd = function(mobile){
    var deferred = Q.defer();
    // true if mobile is found and valid false if not found or not valid
    Logininfo.findOne({"mobile":mobile,"profVerfInd" : true},function(err, user) {
        if (user) {
            deferred.resolve(true);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(false)
            }
        }
    });
    return deferred.promise;
}

exports.updateLoginProfileIndicatorWithTure = function(userId){
    var deferred = Q.defer();
    // true if mobile is found and valid false if not found or not valid
    Logininfo.findOneAndUpdate({"userId":userId},{"profVerfInd" : true},{new : true},function(err, user) {
        if (user) {
            deferred.resolve(true);
        }else {
            if(err){
               deferred.reject(err);
            }else{
               deferred.resolve(false)
            }
        }
    });
    return deferred.promise;
}



/*exports.updateLogininfo = function(id,data){
    var deferred = Q.defer();
    Logininfo.findOneAndUpdate({"_id":id},data, function(err, logininfo) {
        if (user) {
            deferred.resolve(logininfo);
        }else {
            deferred.reject("Error while updating the organization");
        }
    });
    return deferred.promise;
};*/