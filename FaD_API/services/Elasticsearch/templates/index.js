var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var templates = {};
var esMappings = require('../mappings');
var esSettings = require('../settings');
var esAliases = require('../aliases');

function loadTemplates() {
    var files = fs.readdirSync(__dirname);

    files.forEach(function(file) {
        if (file.indexOf('.json') > -1) {
            var template = fs.readFileSync(path.join(__dirname, file));
            var templateName = file.slice(0, -5);

            template = JSON.parse(template);

            Object.keys(template).forEach(function (key) {
                switch (key) {
                    case 'settings':
                        if (template[key].charAt(0) === '$') {
                            template[key] = esSettings.getSetting(template[key].slice(1));
                            if (!template[key]) delete template[key];
                        }
                        break;
                    case 'mappings':
                        template[key] = template[key].reduce(function (finalMappings, mapping) {
                            if (mapping.charAt(0) === '$') {
                                mapping = mapping.slice(1);
                                _.assign(finalMappings, esMappings.getMapping(mapping));
                                if (!finalMappings[mapping]) delete finalMappings[mapping];
                                return finalMappings;
                            }
                        }, {});
                        if (_.isEmpty(template[key])) delete template[key];
                        break;
                    case 'aliases':
                        template[key] = template[key].reduce(function (finalAliases, alias) {
                            if (alias.charAt(0) === '$') {
                                alias = alias.slice(1);
                                _.assign(finalAliases, esAliases.getAlias(alias));
                                if (!finalAliases[alias]) delete finalAliases[alias];
                                return finalAliases;
                            }
                        }, {});
                        if (_.isEmpty(template[key])) delete template[key];
                        break;
                }
            });

            templates[templateName] = template;
        }
    });
}

function getTemplate(name) {
    if (templates[name])
        return _.pick(templates, name);
    else
        return false;
}

exports.loadTemplates = loadTemplates;
exports.getTemplate = getTemplate;
