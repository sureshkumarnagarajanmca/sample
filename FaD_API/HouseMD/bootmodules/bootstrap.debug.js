/**
 *set up debug modes etc
 */

function bootstrapDebug (config) {
    if (!config.app.debug)
        return;

    //enable debug for bluebird promise lib
    require('bluebird').longStackTraces();
    //enable longer stack traces
    require('longjohn');

    //enable mongoose debug, if set
    if (process.env.DEBUG.indexOf('mongoose') > -1)
        require('mongoose').set('debug', true);

    //start repl server
    //use telnet to connect to running server
    //eg: telnet localhost 5673

    var net = require('net');
    var repl = require('repl');
    var debug = require('debug')('remotedebugging');

    var debugServer = net.createServer(function (socket) {
        debug('client connected ', socket.remoteAddress);
        repl.start({
            prompt: 'clientServer>',
            input: socket,
            output: socket,
            useGlobal: true
        }).on('exit', function () {
            socket.end();
            debug('client disconnected', socket.remoteAddress);
        });
    });

    debugServer.on('error', function (e) {
            console.log("Could not start debug server because", e.code);
    });
    debugServer.listen(config.app.debugport);
}

module.exports = bootstrapDebug;
