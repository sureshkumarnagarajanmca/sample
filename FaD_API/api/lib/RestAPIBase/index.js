// global config, AppLogger

//var phone = require('phone');
var ServiceHandler = require('../../serviceHandler');
var errorHandler = ServiceHandler.errorHandler;
var externalErrors = {
    MongoError: require('mongoose').Error
};
var paramType = require('../../validator/paramTypes.js');
var jwt = require('../../../lib/jwt.js');
//var jwtConfig = config.idproxy.jwt;

function RestAPIBase() {}

RestAPIBase.prototype.paramType = paramType;

function logError(err, req) {
    var log = {
        req: req,
        error: err && err.stack || err
    };

    if (err instanceof config.errors.ClientError) {
        log.error = err.toResponse();
    }

    AppLogger.error("error: ", log);
}
RestAPIBase.prototype.handleError = function(err, req, res) {
    if (err instanceof config.errors.ClientError) {
        errorHandler(err, req, res);
    } else if (err instanceof externalErrors.MongoError) {
        errorHandler(new config.errors.Internal(), req, res);
    } else {
        errorHandler(new config.errors.Internal(), req, res);
    }
    logError(err, req);
};

RestAPIBase.prototype.reply = function(err, req, res, result) {
    if (err) {
        this.handleError(err, req, res);
    } else {
        res.json(result || ['SUCCESS']);
    }
};

RestAPIBase.prototype.getE164PhoneNumber = function(phoneNo, req, res) {
    var isoCountryCode = req.headers['x-country-code'] || req.headers['X-Country-Code'];
    var iE164PhoneNumber = phone(phoneNo && phoneNo.trim().toString(), isoCountryCode)[0];
    if (!iE164PhoneNumber) {
        this.handleError(new config.errors.ValidationErrors(), req, res);
        return null;
    }
    return iE164PhoneNumber;
};

RestAPIBase.prototype.signJwt = function(payload) {
    var options = {
        algorithm: jwtConfig.algo,
        expiresInMinutes: jwtConfig.expiry,
        issuer: jwtConfig.issuer
    };

    return jwt.sign(payload, jwtConfig.secret, options);
};

RestAPIBase.prototype.verifyJwt = function(token) {
    var options = {
        issuer: jwtConfig.issuer
    };

    var result = jwt.verify(token, jwtConfig.secret, options);
    if(result instanceof Error){
        throw result;
    }
    return result;
};

module.exports = RestAPIBase;