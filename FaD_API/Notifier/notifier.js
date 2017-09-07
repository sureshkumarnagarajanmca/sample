var express = require('express');
var bodyParser = require('body-parser');
var TwilioService = require('./services/twilio');
// var pushService = require('./services/push');

var authyService = require('./services/authy');

var app = express();
app.use(bodyParser.json());

app.post('/notify', function(req, res, next){
    var body = req.body;
    var mobileNumber = body.countryCode + body.mobile;
    var message = body.message;
    TwilioService.notify({message: message, phone: mobileNumber}, function(err, response){
        // res.end("Sent a notification!");
        if(err){
            res.status(500).send({err : err});
        }else{
            res.send({succ : "otp sent to mobile Number"})
        }
    });
});

app.post('/schedule-notify', function(req, res, next){
    var body = req.body;
    var mobileNumber = body.phone;
    var message = body.message;
    TwilioService.scheduleSms({body: message, phone: mobileNumber, time: body.time});
    res.end("Scheduled notification!");
});

var port = 3005;

// console.log(authyService.checkVerificationCode());

// check phone  
    // send verification token
    app.post('/sendToken', function(req, res, next){
        var body = req.body;
        authyService.sendVerificationCode(body)
        .then(function(succ){
            res.send({succ : succ})
        },function(err){
             res.status(500)
            res.send({err : err})
        })
    });

    // check phone verification
    app.post('/checkToken', function(req, res, next){
        var body = req.body;
        authyService.checkVerificationCode(body)
        .then(function(succ){
            res.send({succ : succ})
        },function(err){
            res.status(500).send({err : err})
        })
    });

app.listen(port, function(){
    console.log("Listening on port: " + port);
});