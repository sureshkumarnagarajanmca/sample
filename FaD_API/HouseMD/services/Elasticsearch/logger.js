var _ = require('lodash');
var Commonlogger = require('../../logger/CommonLogger.js');
var esLoggerConfig = {
    name : 'ESLogger',
    transports : [{
        type: "file",
        transport: {
            filename: config.logger.log_files_path + '/' + config.logger.eslogs.log_file,
            datePattern: ".dd-MM-yyyy",
            maxsize: 1024 * 1024 * 2,
            json: true,
            level: config.logger.eslogs.level
        }
    }]
};

var esLogger = new Commonlogger(esLoggerConfig);

function log (esname, levels) {
    this.error = (levels.indexOf('error') > 0) ? esLogger.error.bind(esLogger, esname) : _.noop;
    this.warning = (levels.indexOf('warning') > 0) ? esLogger.warn.bind(esLogger, esname) : _.noop;
    this.debug = (levels.indexOf('debug') > 0) ? esLogger.debug.bind(esLogger, esname) : _.noop;
    this.info = (levels.indexOf('info') > 0) ? esLogger.debug.bind(esLogger, esname) : _.noop;
    this.trace = (levels.indexOf('trace') > 0) ? function (method, requestUrl, body, responseBody, responseStatus) {
        esLogger.trace(esname, {
            requestMethod: method,
            requestURL: requestUrl,
            requestBody: body,
            responseBody: responseBody,
            responseStatus: responseStatus
        });
    } : _.noop;
    this.close = _.noop;
}

module.exports = function (esname) {
    return log(esname, config.elasticsearch.instances[esname].logLevels);
};
