/*
var accountSSID = "ACfb8f03d4525b63adbdf7d2582a07c502";
var authToken = "d99f84d6958291fca88a15af25aafd70";
*/
var accountSSID ="AC9acd83a41ec19d7b0e4113f8437be185";
var authToken ="76e0e2804e5c5fe693b7bebec7235f26";
var client = require('twilio')(accountSSID, authToken);
var CronJob = require('cron').CronJob;
var moment = require('moment');


// var authy = require('authy')('APIKEY');


function sendSms(data, cb){
      client.sendMessage({
        //to: data.phone,
        // from: '+1 707-595-2237',
        //from: '+1 251-220-2344',
        to : data.phone,
        from : '+1 732-515-4066',
        body: data.message
    }, function(err, responseData){
        console.log(err);
        if(!err){
           cb(null, "success");
       }else{
            cb(err);
        }
    }); 
        // cb(null, "success");
}

function scheduleSms(data){
    var time = new Date(data.time);
    var cb = function(err, status){
        if(err){
            console.log(err);
        }
        else{
            console.log("Sent a notification!", time);
        }
    };
    var job = new CronJob(time, function() {
            sendSms(data, cb);
        }, function (){
            console.log("done");
            cb("fail");
        },
        true
    );
}

module.exports = {
    notify: sendSms,
    scheduleSms: scheduleSms
};
