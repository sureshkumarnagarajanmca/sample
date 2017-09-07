/**
 * Created by pradeep on 4/7/16.
 */
var passport = require('passport')
    , Q = require('q')
    , LocalStrategy = require('passport-local').Strategy
    // , BasicStrategy = require('passport-http').BasicStrategy
    // , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
    // , BearerStrategy = require('passport-http-bearer').Strategy
    , User = require('../../api/services/LogininfoService')
    , accessTokens = require('../../api/services/AccessTokenServices')
    , UserService = require('../../api/services/UserService')
    , crypto                =  require('crypto')
    , security = require('../../utils/crypto');

var errorFunctions = require('../../api/errorCodeFunctions');

var _ = require('lodash');



exports.erroHandlingLogin  = function(req,res,next){
    console.log(req.user.hasOwnProperty("errCode"));
    if(req.user.hasOwnProperty("errCode")){
        res.status(401).send(req.user);
    }else{
        next();
    }
}


passport.use(new LocalStrategy(
     // console.log(euser);
  function(username, password ,done) {
    'use strict';
    console.log(username,password)
    User.getUserByLoginOnEmailOrMobileOnProfileVerfInd(username).then(function (userCheck) {
        if(userCheck){
            User.getUserByLoginOnEmailOrMobileAndPwdOnProfileVerfInd(username,security.encrypt(password)).then(function (user) {
                if(user){
                    if(!!user.profVerfInd){
                        var obj = {};
                        obj.source = user.source;
                        obj.userId = user.userId;
                        obj.login = user.login;
                        done(null, obj);
                    }else{
                        // need to send otp 
                        // user not found that user not validated is similat ot usr not found.
                           return done(null,{"errCode" : "USRNTFND"},false)
                        // return done(null,{"errCode" : "PROFNOTVERFD"})  
                    }
                }else{
                    // done(null,false,{message : "password mis match"});
                    // return done({"errCode" : "PWDWRG"},false)
                    return done(null,{"errCode" : "PWDWRG"},false)
                } 
            },function(err){
                 return done(null,{"errCode" : "INTRNLSRVRERROR"},false);
            })
        }else{
            // return done(null,false,{message : "user not found"});   
            // return done({"errCode" : "USRNTFND"},false)
                return done(null,{"errCode" : "USRNTFND"},false)
        }

    },function(err){
       return done(null,{"errCode" : "INTRNLSRVRERROR"},false);
    });
  }
));

passport.use('onSignUp',new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'userId',
    session: false
  },
     // console.log(euser);
  function(username, password ,done) {
    'use strict';
    console.log("username");
    User.getUserByUserId(username).then(function (user) {
        if(user){
                var obj = {};
                obj.source = user.source;
                obj.userId = user.userId;
                obj.login = user.login;
                done(null, obj);
        }else{
            // return done(null,false,{message : "user not found"});   
            return  done(null,{"errCode" : "USRNTFND"},false)
        }
    },function(err){
        if (err) { return done(null,{"errCode" : "INTRNLSRVRERROR"},false,{ message: 'Incorrect password.' }) 
    }
    });
  }
));



// need to change once we intgrate with db 
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var sessionInfo = new Schema({},{strict : false});

var clientInfo = new Schema({},{strict : false});



var sessionData = mongoose.model('sessionInfo',sessionInfo);

var client = mongoose.model('clientInfo',clientInfo);

var jwt = require('jsonwebtoken');
var JWT_SECRET = 'Fad secret';

exports.generateToken = function(req, res, next) {  
  req.token = {};
  console.log("req.user");
  console.log(req.user);
    console.log("req.user");
  var userObj = JSON.parse(JSON.stringify(req.user));
  // console.log(req.use)
  req.token.accessToken = jwt.sign({
    id: userObj.userId
  }, JWT_SECRET, {
    expiresIn: 24 * 60 * 60 * 1000 
  });
  var obj = {
    userId : userObj.userId,
    accessToken : req.token.accessToken
  }

  console.log(accessTokens)

  accessTokens.addrefreshToken(obj.userId,obj)
  .then(function(succ){
        next();
  },function(err){
        errorFunctions.sendInternalServerError(req,res)
  })
}

exports.serialize =  function (req, res, next) {
  sessionData.findOneAndUpdate({_id : req.user.userId},{ $set : req.user}, {upsert: true, new : true},function(err, userInfo){
    if(err) {return next(err);}
    // we store the updated information in req.user again
    // req.user = {
    //   id: user.id
    // };
    console.log(userInfo);
    next();
    // next();
  });
}

exports.serializeClient =  function (req, res, next) {
  client.findOneAndUpdate({_id : req.user.userId},{ $set : req.user}, {upsert: true, new : true},function(err, clientInfo){
    if(err) {return next(err);}
    req.user.clientId = clientInfo._id;
    next();
  });
}

exports.generateRefreshToken =  function (req, res, next) {
    req.token.refreshToken = req.user.clientId.toString() + '.' + crypto.randomBytes(40).toString('hex');
    console.log(req.token.refreshToken);
    client.findOneAndUpdate({_id: req.user.clientId},{$set : {refreshToken: req.token.refreshToken}},{new : true},function(err,data){
        if(!err){
            console.log(data);
        }
        next();
    })
}

exports.validateRefreshToken = function(req, res, next) {  
  client.findOne({"refreshToken" : req.body.refreshToken}, function(err, client) {
    console.log(err,client);
    if (err) {
      // return next(err);
      console.log(err);
      errorFunctions.sendInternalServerError(req,res)
    } else{
        if(!client){
            errorFunctions.invalidRefreshToken(req,res);
        }else{
           req.user = client;
            next(); 
        }
    }
  });
}

var authenticateToken = function(accessTokenInfo, userId) {
    var deferred = Q.defer();
    jwt.verify(accessTokenInfo, JWT_SECRET, function(err, decoded) {
        if(err){
            deferred.reject(err);
        }else{
            // console.log(decoded);
            if(decoded.id === userId){
                deferred.resolve();
            }
            // accessTokens.findOne({userId : decoded.id},function(err, succ){
            //     if(err){
            //         deferred.reject(false);
            //     }else{
            //         if(succ){
            //             if(succ.userId === userId){
            //                 deferred.resolve();
            //             }else{
            //                 deferred.reject(false);
            //             }
            //         }else{
            //             deferred.reject(false);
            //         }
            //     }
            // });
        }
    });
    return deferred.promise;
}

exports.checkAuthentication = function(req,res,next){

    var accessToken = (req.body.accessToken || req.params.accessToken || req.query.accessToken || req.get('accessToken')); 



    var userId = (req.body.userId || req.params.userId || req.params.userId || req.body.doctorId || req.params.doctorId || req.params.doctorId)
    if(!!userId && !(req.originalUrl.indexOf('/resetPassword') > -1)){
        if(accessToken){
            authenticateToken(accessToken,userId)
            .then(function(succ){
                next();
            },function(err){
                res.status(401);
                if(err){
                    // res.send(err);
                     errorFunctions.expiredAccesToken(req,res);
                }else{
                     errorFunctions.wrongAccessToken(req,res);
                    // res.send({error_message : "Wrong Access Token"});
                }
            })
        }else{
             errorFunctions.noAccessToken(req,res);
        }
    }else{
        next();
    }
}


exports.responeObjectOnValidateToken = function(req,res){
    // console.log(req.user,req.token);

    var result = {
        accessToken : req.token.accessToken,
        userId : req.user.userId
    }
    res.send(result);
}
// Passport needs to be able to serialize and deserialize users to support persistent login sessions
// passport.serializeUser(function(user, done) {
//     console.log(user);
//    // console.log('serializing user: ');console.log(user);
//    UserService.getUserById(user).then(function(succ){
//        // var result =  _.merge({},user,succ);
//        var result = user.userId
//        done(null,result);
//    },function(err){
//         done(null, false,{"message" : "User Not Found"});
//    });
// });

// passport.deserializeUser(function(id, done) {
//     // console.log("id"); 
//     // console.log(id);
//    //  User.getUserByUserId(id, function(err, user) {
//    //     console.log('deserializing user:',user);
//    //      done(err, user);
//    // });
//     User.getUserByUserId(id.userId)
//     .then(function(succ){
//         console.log("succ");
//         done(null, user);
//     },function(err){
//         done(err, false);
//     })
// });

// passport.use(new ClientPasswordStrategy(
//     function(clientId, clientSecret, username, password, done) {
//         if(client.clientId == clientId) {
//             if(password = security.encrypt(password)) {
//                 User.userLogin(username, password).then(function (result) {
//                         if(result){
//                             var loginInfo = result.toObject();
//                             UserService.getUserById(loginInfo.userId).then(function(user){
//                                 var user = user.toObject();
//                                 var userInfo = {};
//                                 useruserInfo.email = user.username;
//                                 userInfo.mobile = user.mobile;
//                                 userInfo.userId = user._id;
//                                 userInfo.lastName = user.lastName;
//                                 userInfo.firstName = user.firstName;
//                                 done(null, {cleint : client, user : userInfo});
//                             }).fail(function(err){
//                                 done(null, false, { message: 'Error while login' });
//                             });

//                         }else{
//                             done(null, false, { message: 'User doesn\'t exist.' });
//                         }

//                     })
//                     .fail(function (err) {
//                         done(null, false, { message: 'Error while login' });
//                     });
//             }else{
//                 done(null, false, { message: 'Error while authenticating the user' });

//             }
//         }
//     }
// ));
// passport.use(new BearerStrategy(
//     function(accessToken, done) {
//         db.accessTokens.find(accessToken, function(err, token) {
//             if (err) { return done(err); }
//             if (!token) { return done(null, false); }

//             db.users.find(token.userID, function(err, user) {
//                 if (err) { return done(err); }
//                 if (!user) { return done(null, false); }
//                 // to keep this example simple, restricted scopes are not implemented,
//                 // and this is just for illustrative purposes
//                 var info = { scope: '*' }
//                 done(null, user, info);
//             });
//         });
//     }
// ));


