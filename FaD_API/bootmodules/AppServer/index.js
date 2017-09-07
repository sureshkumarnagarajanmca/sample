/**
 * Created by pradeep on 2/25/16.
 */
/**
 * This is main file to create server and configure the routes to map URL for
 * various resources on the server.
 */

exports.start = function(){
    var _serverInst;
    process.on('uncaughtException', function (err) {
        console.log('Caught exception bubbled to node: ' + err);
        console.log('Stack trace of error :');
        console.log (err.stack);

        setTimeout(function () {
            process.exit(1);
        }, 2000);

        try {
            AppLogger.fatal(err.stack);
        } catch (e) {
            console.log(e);
        }
    });

    try {
        _serverInst= require('./createServer.js').start();
    } catch (e) {
        console.log("FATAL: exception starting server");
        console.log(e);
        if (e.stack) console.log(e.stack);

        process.exit(78);
    }

    return _serverInst;
};

exports.createApp = require('./createServer.js').createApp;
