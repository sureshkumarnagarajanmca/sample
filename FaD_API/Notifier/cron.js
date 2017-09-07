var CronJob = require('cron').CronJob;

var moment = require('moment');
var time = new Date(moment().add(5, 's'));

var job = new CronJob(time, function() {
        /* runs once at the specified date. */
        console.log(new Date());
        console.log("doing..")
    }, function () {
        /* This function is executed when the job stops */
        console.log("done")
    },
    true /* Start the job right now */
);