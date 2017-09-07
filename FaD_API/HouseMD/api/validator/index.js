/*global AppLogger*/
var fs = require('fs'),
	path = require('path'),
	Validator = require('jsonschema').Validator,
	allmodels = {};

function loadModels() {

	fs.readdirSync(path.join(__dirname, 'models')).forEach(function(file) {
		if(file !== '.DS_Store'){
			var models = require('./models/' + file);
			for (var m in models) {
				if (models.hasOwnProperty(m)) {
					allmodels[m] = models[m];
				}
			}
		}
	});
}

function validator(value, schema) {
	var v = new Validator();
	var modelSchema = allmodels[schema];

	function importNextSchema() {
		var nextSchema = v.unresolvedRefs.shift();
		if (nextSchema) {
			var model = allmodels[nextSchema.replace('/', '')];
			v.addSchema(model, '/' + model.id);
			importNextSchema();
		}
	}

	if (modelSchema) {
		v.addSchema(modelSchema);
		importNextSchema();
	} else {
		modelSchema = schema;
	}
	return v.validate(value, modelSchema);
}

function getParamSchemaAndValue(req, param) {
	var schemaAndValue = [];
	var paramtype;
	switch (param.paramType) {
		case "path":
			paramtype = "params";
			schemaAndValue.push(req[paramtype][param.name]);
			schemaAndValue.push(param);
			break;
		case "query":
			paramtype = "query";
			schemaAndValue.push(req[paramtype][param.name]);
			schemaAndValue.push(param);
			break;
		case "header":
			paramtype = "headers";
			schemaAndValue.push(req[paramtype][param.name]);
			schemaAndValue.push(param);
			break;
		case "body":
			if (param.name === 'body' || param.name === '') {
				schemaAndValue.push(req.body);
			} else {
				schemaAndValue.push(req.body[param.name]);
			}

			if (allmodels[param.type]) {
				schemaAndValue.push(param.type);
			} else {
				schemaAndValue.push(param);
			}
			break;
		case "form":
			schemaAndValue.push(req.body[param.name]);
			schemaAndValue.push(param);
			break;
	}
	return schemaAndValue;
}

function errorHandler(req, res, errors) {
	var log = {
		req: req,
		resource: req.resource || req.url,
		action: req.action || req.method,
		error: errors
	};
	//AppLogger.warn('Validation errors', log);
	res.status(412).send({
		"errors": [{
			"msg": "Validation errors/ Invalid arguments",
			"code": 412
		}]
	});
}

function validate(schema, req, res, next) {
//    console.log(JSON.stringify(schema,null,4));
	req.schemaParams = schema.parameters;
	var errors = [];
	if (!(schema.parameters && schema.parameters.length > 0)) {
		next();
		return;
	}
	schema.parameters.forEach(function(p) {
		if (p.paramType.trim() === 'body' || p.paramType.trim() === '') { // validate only body
			var schemaAndValue = getParamSchemaAndValue(req, p);
			var result = validator(schemaAndValue[0], schemaAndValue[1]);
			errors.push.apply(errors, result.errors);
		}
	});
	if (errors && errors.length > 0) {
		errorHandler(req, res, errors);
		console.log(errors);
		return false;
	}

	next();
}

function getValidator(schema) {
	return function(req, res, next) {
		validate(schema, req, res, next);
	}
}

function validateQueryParams(req, res, next) {
	var userContext = req.userContext;
	var qUserId = req.params && req.params.userId;
	var qOrgId = req.params && req.params.orgId;
	var qAccountId = req.params && req.params.accountId;

	//validate request url userId and orgId 
	if (userContext && ((qUserId && qUserId !== userContext.userId) ||
		(qOrgId && qOrgId !== userContext.orgId) ||
		(qAccountId && qAccountId !== userContext.accountId))) {
		return res.status(401).send({
			"errors": [{
				"msg": "Unauthorized",
				"code": 401
			}]
		});
	}
	next()
}

loadModels();

module.exports = {
	models: allmodels,
	getValidator: getValidator,
	validate: validator,
	validateQueryParams: validateQueryParams
};
