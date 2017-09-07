/*
 * logger module dependencies
 */
var winston = require('winston');
var logLevels;
var serverVersion = config.app.commit;
var hostname = config.app.hostname;
var _ = require('lodash');

require('winston-logstash');
logLevels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
    data: 6,
    "@cee": 7
};

/*
 *Common logger is wrapper on existing logger library
 */
var CommonLogger = function(conf) {
    var self = this;
    this.logName = conf.name;
    /*Winston logger instance*/
    this.instance = new(winston.Logger)({
        levels: logLevels
    });

    /**
     * Function to initialiaze logger intance.
     * @param conf
     *      logger configuration
     *
     */

    function init(conf) {
        var i, transport, transportOptions;
        for (i = 0; i < conf.transports.length; i = i + 1) {
            transport = conf.transports[i];
            transportOptions = transport.transport;
            if (transport) {
                if (transport.type === 'logstash') {  //config.logger.enableLogstashlogs
                    self.instance.add(winston.transports.Logstash, transportOptions);
                } else if (transport.type === 'file') {   //config.logger.enablefilelogs
                    if (transport.rotate === false)
                        self.instance.add(winston.transports.File, transportOptions);
                    else
                        self.instance.add(winston.transports.DailyRotateFile, transportOptions);
                } else {
                    self.instance.add(winston.transports.Console);
                }
            }
        }
        if (['development', 'dev'].indexOf(process.env.NODE_ENV) > -1) {
            self.instance.add(winston.transports.Console);
        }
    }

    init(conf);
};

function setMetadata(meta) {
    var userContext, req;

    req = meta.req;
    userContext = meta.userContext || (req && req.userContext);
    meta.serverVersion = serverVersion;
    meta.hostname = hostname;

    if (req) {
        meta.clientVersion = req.headers['x-app-version'];
        meta.clientIp = req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress));
        meta.serverIp = req.hostname || req.host;
        meta.userAgent = meta.userAgent || req.headers['user-agent'];

        delete meta.req;
    }

    if (userContext) {
        meta.clientId = userContext.clientId;
        meta.userType = meta.userType || userContext.userType;
        meta.userId = meta.userId || userContext.userId;
        meta.orgId = meta.orgId || userContext.orgId;
        meta.tenantId = meta.tenantId || userContext.orgId;
        meta.accountId = meta.accountId || userContext.accountId;
        meta.objectId = meta.objectId || userContext.objectId;
        meta.details = meta.details || userContext.details;
        meta.userAgent = meta.userAgent || userContext.userAgent;
        delete meta.userContext;
    }
    if (meta.type) {
        delete meta.type;
    }

    //handle promise errors
    for(var p in meta){
        if(meta[p] instanceof config.errors.ClientError){
            meta[p] = meta[p].toResponse();
        }
        else if(meta[p] instanceof Error){
            meta[p] = meta[p].stack;
        }
    }

    return meta;
}

/**
 * Function to create trace, debug, info, warn, error and fatal log
 * @param message
 *          log message
 * @param metadata
 *          contains resource, action , userContext, req objects
 * @param callback
 *          function to return login status - valid/invalid user
 */
CommonLogger.prototype.log = function(level, message, metadata, callback) {
    var logmeta;
    if (message && typeof message === 'object') {
        message = message && _.clone(message, true);
    }
    if (metadata && typeof metadata === 'object') {
        metadata = metadata && _.clone(metadata, true);
    }

    if (metadata && callback) {
        this.instance.log(level, message, setMetadata(metadata), callback);
    } else if (metadata) {
        this.instance.log(level, message, setMetadata(metadata));
    } else {
        logmeta = {
            serverVersion: serverVersion,
            hostname: hostname
        };
        if (typeof message === 'string') {
            this.instance.log(level, message, logmeta);

        } else if (message instanceof Error) {
            this.instance.log(level, message.stack, logmeta);
        } else if (message && typeof message === 'object') {
            message.serverVersion = serverVersion;
            message.hostname = hostname;
            delete message.type;
            this.instance.log(level, setMetadata(message));
        } else {
            this.instance.log(level, message);
        }
    }
};

CommonLogger.prototype.trace = function(message, metadata, callback) {
    this.log('trace', message, metadata, callback);
};

CommonLogger.prototype.debug = function(message, metadata, callback) {
    this.log('debug', message, metadata, callback);
};

CommonLogger.prototype.info = function(message, metadata, callback) {
    this.log('info', message, metadata, callback);
};

CommonLogger.prototype.warn = function(message, metadata, callback) {
    this.log('warn', message, metadata, callback);
};

CommonLogger.prototype.error = function(message, metadata, callback) {
    this.log('error', message, metadata, callback);
};

CommonLogger.prototype.fatal = function(message, metadata, callback) {
    this.log('fatal', message, metadata, callback);
};

CommonLogger.prototype.data = function(message, metadata, callback) {
    this.log('data', message, metadata, callback);
};

module.exports = CommonLogger;
