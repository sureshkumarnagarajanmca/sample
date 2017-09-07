(function () {
    'use strict'
    var supportModel = require('../../db/dbModels/support');
    //bcrypt = require('bcrypt');
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Q = require('q');
//     var nodemailer = require('nodemailer');

    
//     var smtpConfig = {
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true, // use SSL 
//         auth: {
//             user: 'anhsirkias@gmail.com',
//             pass: 'Hello@123'
//         }
//     };
    
//     var transporter = nodemailer.createTransport(smtpConfig);

// // setup e-mail data with unicode symbols 
// var mailOptions = {
//     from: "anhsirkias@gmail.com", // sender address 
//     to: "anhsirkias@gmail.com",
//     replyTo : "anhsirkias@gmail.com", // list of receivers 
//     subject: 'test', // Subject line 
//     text: 'Helloworld' // plaintext body 
// };
 
// // send mail with defined transport object 
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Message sent: ' + info.response);
// });

    var supportServices = {
        sendSupportMail : sendSupportMail
    }

    function suppoerMailObjectMapping(data){
        var mailData = {};
        mailData.name = data.name;
        mailData.email = data.email;
        mailData.message = data.message;
        for(var i in  data){
            if(!data[i]){
                delete data[i];
            }
        }
        return mailData;
    }

    function sendSupportMail(name, email, message){
        var deferred = Q.defer();
        var mailData = suppoerMailObjectMapping({name : name , email : email , message : message});
        supportModel.create(mailData,function(err,succ){
            if(err){
                deferred.reject(err)
            }else{
                deferred.resolve(succ)
            }
        });
        return deferred.promise; 
    }

    module.exports = supportServices;

})()


