// global config
var config = require('../../config');


// console.log(config);

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    apiVersion = config.app.commit,
    swaggerVersion = "1.2",
    resources = {},
    allmodels = {},
    allowedDataTypes = ['string', 'integer', 'number', 'boolean', 'array','date'],
    apiInfo = {
        "title": "client API",
        "description": "",
        "termsOfServiceUrl": "http://helloreverb.com/terms/",
        // "contact": "apiteam@wordnik.com",
        "license": "Apache 2.0",
        "licenseUrl": "http://www.apache.org/licenses/LICENSE-2.0.html"
    };

function addModels(models) {
    allmodels = models;
}

function addApiResource(apiBasePath, resourcePath, description) {
    if (!resourcePath) return;
    var r = {
        apiVersion: apiVersion,
        swaggerVersion: swaggerVersion,
        basePath: apiBasePath,
        resourcePath: resourcePath,
        description: description,
        produces: ['application/json'],
        apis: [],
        models: {}
    };

    resources[resourcePath] = r;
}


// Add model to list and parse List[model] elements
function addModelsFromBody(operation, models) {
// console.log(models);
    if (operation.parameters) {
        _.forOwn(operation.parameters, function(param) {
            if (param.paramType === "body" && param.type) {
                if (param.type && typeof param.type === 'string') {
                    var model = param.type.replace(/^List\[/, "").replace(/\]/, "");
                    models.push(model);
                }

            }
        });
    }
}

// Add model to list and parse List[model] elements
function addModelsFromResponse(operation, models) {
    var responseModel = operation.type;
    if (responseModel === "array" && operation.items) {
        var items = operation.items;
        if (items["$ref"]) {
            models.push(items["$ref"]);
        } else if (items.type && allowedDataTypes.indexOf(items.type) === -1) {
            models.push(items["type"]);
        }
    }
    // if not void or a json-schema type, add the model
    else if (responseModel !== "void" && allowedDataTypes.indexOf(responseModel) === -1) {
        models.push(responseModel);
    }
}

function addPropertiesToRequiredModels(properties, requiredModels) {
    _.forOwn(properties, function(property) {
        var type = property["type"];
        if (type) {
            switch (type) {
                case "array":
                    if (property.items) {
                        var ref = property.items.$ref;
                        if (ref && requiredModels.indexOf(ref) < 0) {
                            requiredModels.push(ref);
                        }
                    }
                    break;
                case "string":
                case "integer":
                    break;
                default:
                    if (requiredModels.indexOf(type) < 0) {
                        requiredModels.push(type);
                    }
                    break;
            }
        } else {
            if (property["$ref"]) {
                requiredModels.push(property["$ref"]);
            }
        }
        if (property.properties) {
            addPropertiesToRequiredModels(property.properties, requiredModels);
        }
    });
}

function addApiMethod(resourcePath, path, method, mappingEndpoint) {
    var r = resources[resourcePath];
    var requiredModels = [];
    if (!r) return;
    if (!mappingEndpoint.summary) return;
    var operations = [];
    var operation = {
        method: method.toUpperCase(),
        summary: mappingEndpoint.summary,
        notes: mappingEndpoint.notes,
        type: mappingEndpoint.type || 'void',
        nickname: mappingEndpoint.summary ? mappingEndpoint.summary.trim().replace(' ', '') : '',
        parameters: mappingEndpoint.parameters,
        responseMessages: mappingEndpoint.responseMessages

    };
    if (mappingEndpoint.items) {
        operation.items = mappingEndpoint.items;
    }
    if (mappingEndpoint.authorizations) {
        operation.authorizations = mappingEndpoint.authorizations;
    }
    operations.push(operation);
    addModelsFromBody(operation, requiredModels);
    addModelsFromResponse(operation, requiredModels);
    _.forOwn(requiredModels, function(modelName) {
        var model = allmodels[modelName];
        if (model) {
            r.models[modelName] = model;
        }
    });
    //  look in object graph
    _.forOwn(r.models, function(model) {
        if (model && model.properties) {
            addPropertiesToRequiredModels(model.properties, requiredModels);
        }
    });
    _.forOwn(requiredModels, function(modelName) {
        if (!r[modelName]) {
            var model = allmodels[modelName];
            if (model) {
                r.models[modelName] = model;
            }
        }
    });

    var urlarr = path.split('/');
    var re = new RegExp(":(\\w+)");
    for (var i = 0; i < urlarr.length; i++) {
        if(urlarr[i] && urlarr[i].match(re)){
          urlarr[i] = urlarr[i].replace(re,"{"+"$1"+"}");
        }
    }
    path = urlarr.join('/');
    r.apis.push({
        path: path,
        operations: operations
    });

}

function resourceListing(req, res) {
    var r = {
        "apiVersion": apiVersion,
        "swaggerVersion": swaggerVersion,
        "apis": []
    };


    // if (authorizations != null)
    //     r["authorizations"] = authorizations;

    if (apiInfo !== null)
        r["info"] = apiInfo;

    _.forOwn(resources, function(value, key) {
        r.apis.push({
            "path": key,
            "description": value.description
        });
    });

    res.write(JSON.stringify(r));
    res.end();
    // res.send(r);
}

function apiListing(req, res) {
    var r = resources['/' + req.params.resource];
    res.write(JSON.stringify(r));
    res.end();
    // res.send(r);
}

function configure(app, apidocsMetaUrl, apidocRoute) {
    var serveStatic = require('serve-static');
    var swaggerUIPath = path.resolve(__dirname, 'swagger-ui/dist');
    var docs_handler = serveStatic(swaggerUIPath);
    var docsRoute = util.format('^\%s(\/.*)?$', apidocRoute);
    var apiBaseUrl = util.format('http://%s:%s', config.app.hostname, config.app.port);

    app.get(apidocsMetaUrl, resourceListing);
    app.get(apidocsMetaUrl + '/:resource', apiListing);

    app.get(new RegExp(docsRoute), function(req, res, next) {
        if (req.url === apidocRoute) { // express static barfs on root url w/o trailing slash
            res.writeHead(302, {
                'Location': req.url + '/'
            });
            res.end();
            return;
        }
        // take off leading /docs so that connect locates file correctly
        req.url = req.url.substr((apidocRoute).length);
        return docs_handler(req, res, next);
    });
}

module.exports = {
    addModels: addModels,
    addApiResource: addApiResource,
    addApiMethod: addApiMethod,
    configure: configure
};
