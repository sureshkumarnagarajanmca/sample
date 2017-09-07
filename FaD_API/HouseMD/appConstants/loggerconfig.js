/*global _appConsts, config*/
/*
var logstashHost = config.logger.logstashhost;
var logsFolder = config.logger.log_files_path;
*/
var logstashHost = 'localhost:3004';
//var logsFolder = '/usr/logs';
var logsFolder = '/logs';
var loggerConfig = {
    components: [{
        name: "AccessLogger",
        transports: [{
            type: "file",
            transport: {
                filename: logsFolder + "/access-logs",
                datePattern: ".dd-MM-yyyy",
                maxsize: 1024 * 1024 * 5,
                json: true,
                level: "info"
            }
        }, {
            type: "logstash",
            transport: {
                //port: config.logger.accesslogs.logstashport,
                port: 3004,
                //node_name: config.logger.accesslogs.node_name,
                node_name: 'FaD',
                host: logstashHost,
                level: "info"
            }
        }]
    }, {
        name: "AppLogger",
        transports: [{
            type: "file",
            transport: {
                filename: logsFolder + "/app-logs.log",
                datePattern: ".dd-MM-yyyy",
                maxsize: 1024 * 1024 * 2,
                json: true,
                level: 2
                //level: config.logger.applogs.level
            }
        }, {
            type: "logstash",
            transport: {
                //port: config.logger.accesslogs.logstashport,
                port: 3004,
                //node_name: config.logger.accesslogs.node_name,
                node_name: 'FaD',
                host: logstashHost,
                level: "info"
            }
        }]
    }, {
        name: "SecurityLogger",
        transports: [{
            type: "file",
            transport: {
                filename: logsFolder + "/security-logs.log",
                datePattern: ".dd-MM-yyyy",
                maxsize: 1024 * 1024 * 5,
                json: true,
                level: "info"
            }
        }, {
            type: "logstash",
            transport: {
                //port: config.logger.accesslogs.logstashport,
                port: 3004,
                //node_name: config.logger.accesslogs.node_name,
                node_name: 'FaD',
                host: logstashHost,
                level: "info"
            }
        }]
    }, {
        name: "UsageLogger",
        transports: [{
            type: "file",
            transport: {
                filename: logsFolder + "/usage-logs.log",
                datePattern: ".dd-MM-yyyy",
                maxsize: 1024 * 1024 * 5,
                json: true,
                level: "info"
            }
        }, {
            type: "logstash",
            transport: {
                //port: config.logger.accesslogs.logstashport,
                port: 3004,
                //node_name: config.logger.accesslogs.node_name,
                node_name: 'FaD',
                host: logstashHost,
                level: "info"
            }
        }]
    },{
        name: "AuditLogger",
        transports: [{
            type: "file",
            rotate:false,
            transport: {
                filename: logsFolder + "/audit.log",
                json:false,
                level: "info",
                timestamp:false
            }
        }]
    }]
};
module.exports = loggerConfig;