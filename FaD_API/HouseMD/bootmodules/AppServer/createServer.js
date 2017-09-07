/**
 * Created by pradeep on 2/25/16.
 */
/**
 * Creates a HTTP server using cluster
 */
var cluster     = require('cluster');

var config      = require('../../config');

var workerCount = config.app.workerCount;
var http        = require('http');
var util        = require('util');
var errors      = require('../../api/errors');

if (config.app.noCluster) {
    cluster = {
        'isMaster': true,
        'worker': {
            'id': 1,
            'disconnect': function () {},
            'process': process
        }
    };
}

/**
 * setup a timer to kill process on error cases
 * @returns {Object} Timer
 */
function shutdown () {
    var shutdownTimer = setTimeout(function () {
        process.exit(1);
    }, config.app.ttlOnError);
    shutdownTimer.unref();

    return shutdownTimer;
}

/**
 * consistent process logging
 * @param {String} msg - must have placeholders for worker.id and worker.process.id
 * @param {Object} worker
 * @param {Number} worker.id
 * @param {Object} worker.proccess
 * @param {Number} worker.process.pid
 * @param {*} any - optional arguments that will be used in the message in the right order
 * @returns {String} - the string that was logged
 */
function logp () {
    var args = Array.prototype.slice.call(arguments);
    args.splice(1, 1, args[1].id, args[1].process.pid);
    args = util.format.apply(null, args);
    console.log(new Date(), args);
    return args;
}

/**
 * create an app with given configuration
 * @param {Object} conf - complete configuration //see clientServer/config
 * @returns {Function} - instance of express application
 */
function createApp (conf) {
    var bootstrap = require('../bootstrap.js');
    var express = require('express');
    bootstrap.init(conf); // for temporary
    var app = express();
    app.disable('x-powered-by');
    app.disable('etag');
    app.set('trust proxy', conf.app.trust_proxy);
    //Invoke boot action
    require('./boot')(app);
    return app;
}

function _createHttpServer() {

    //signal handlers for process
    if (cluster.isMaster && (process.platform !== 'win32')) {
        process.on('SIGINT', function () {
            process.exit(0);
        });
        process.on('exit', function (code) {
            if (code === 0) {
                console.log('\nclientserver: master [PID %d] stopped', process.pid);
                console.log('\033[1Gbye');
                return;
            }
            console.log('clientserver: master [PID %d] exiting with code %d', process.pid, code);
        });
    }

    // only master process can spawn worker processes
    if (cluster.isMaster && (workerCount !== 0)) {
        cluster.on('exit', function(worker, code, signal) {
            logp('clientserver: worker %d [PID: %d] died with code %s',
                worker, signal || code);
            if (code !== 78) cluster.fork();
        });

        cluster.on('disconnect', function (worker) {
            logp('clientserver: worker %d [PID: %d] shutting down', worker);
        });

        cluster.on('listening', function(worker, address) {
            logp('clientserver: worker %d [PID: %d] listening to %s/%d',
                worker, address.address, address.port);
        });

        // Fork workers
        console.log('clientserver: master [PID: %d] started', process.pid);
        var i = 0;
        for (i = 0; i < workerCount; i+=1) {
            cluster.fork();
        }

        process.title = 'clientserver: master';
    } else {

        //workers create their own servers

        var workerApp = createApp(config);
        logp('clientserver: worker %d [PID: %d] started in %s mode',
            cluster.worker, workerApp.settings.env);

        //using domains
        //see: http://nodejs.org/api/domain.html#domain_warning_don_t_ignore_errors
        var domain = require('domain');
        /*
         http.createServer((req, res) => {
         res.writeHead(200);
         res.end('hello world\n');
         }).listen(8000);
         */
        var server = http.createServer(function (req, res) {
         //   res.writeHead(200);
          //  res.end('hello world\n');
            var d = domain.create();
            //res.writeHead(200);
            //res.end('Welcome to Fad\n');
            d.on('error', function (err) {
                logp('clientserver: worker %d [PID: %d]: caught error in domain for request %s',
                    cluster.worker, req.url);
                errors.loge(err);
                var errorResponse = (new errors.Internal()).toResponse();

                try {
                    //setup shutdownTimer
                    shutdown();

                    //only try to close once
                    if (server.address()) {
                        logp('clientserver: worker %d [PID: %d] attempting to shutdown gracefully', cluster.worker);
                        server.close();
                        cluster.worker.disconnect();
                    }

                    res.statusCode = errorResponse.status;
                    if (!res.headersSent) {
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('resource-error-description', errorResponse['response-error-description']);
                    }
                    res.end(JSON.stringify(errorResponse.body) + '\n');
                } catch (err2) {
                    logp('clientserver: worker %d [PID: %d] failed to handle response on error',
                        cluster.worker);
                    errors.loge(err2);
                }
            });

            d.add(req);
            d.add(res);
            d.run(function () {
                workerApp(req, res);
            });
        });

        server.listen(config.app.port, function () {
            if (config.app.noCluster) {
                var address = server.address();
                logp('clientserver: worker %d [PID: %d] listening to %s/%d',
                    cluster.worker, address.address, address.port);
            }
        });

        server.on('error', function (err) {
            errors.loge(err);
            switch (err.code) {
                case 'EADDRINUSE':
                    logp('clientserver: worker %d [PID: %d] failed to listen on port %d [EADDRINUSE]',
                        cluster.worker, config.app.port);
                    process.exit(78);
                    break;
                case 'EACCES':
                    logp('clientserver: worker %d [PID: %d] cannot access port %d [EACCES]',
                        cluster.worker, config.app.port);
                    process.exit(78);
                    break;
                default:
                    shutdown();
                    server.close();
                    break;
            }
        });

        process.title = 'clientserver: worker ' + cluster.worker.id;
    }
}

module.exports = {
    start: function() {
        return _createHttpServer();
    },
    createApp: createApp
};
