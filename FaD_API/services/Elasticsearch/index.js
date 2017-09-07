var Promise = require('bluebird');
var _ = require('lodash');
var loge = config.errors.loge;
var es = require('elasticsearch');
var esLogger = require('./logger.js');
var esConfig = config.elasticsearch;
var esMapping = require('./mappings');
var esSettings = require('./settings');
var esAliases = require('./aliases');
var esTemplates = require('./templates');

var esClients = {};

function init(callback) {
    var esnames = _.keys(esConfig.instances);
    var allConnectP;

    esMapping.loadMappings();
    esSettings.loadSettings();
    esAliases.loadAliases();
    esTemplates.loadTemplates();

    allConnectP = esnames.map(function (esname) {
        var config = esConfig.instances[esname];

        esClients[esname] = new es.Client({
            host: {
                host: config.host,
                port: config.port
            },
            log: esLogger(esname)
        });

        return esClients[esname].ping({requestTimeout: 5000})
        .then(function() {
            console.log('Connected to elasticsearch: %s on host: %s, port: %s', esname, config.host, config.port);
            if (config.templates && config.templates.length) {
                var templates = config.templates.map(function (template) {
                    return esClients[esname].indices.putTemplate({
                        name : template,
                        body : esTemplates.getTemplate(template)[template]
                    });
                });

                return Promise.all(templates);
            }
        })
        .catch(function (error) {
            if (config.required) {
                loge(error);
                console.log('Exiting: Required resource is missing: elasticsearch: %s on host: %s, port: %s', esname, config.host, config.port);
                process.exit(78);
            }
        });
    });

    return Promise.all(allConnectP).nodeify(callback);
}

exports.init = init;

function getESClient(esname) {
    return esClients[esname];
}

exports.getESClient = getESClient;
