/* jshint latedef: nofunc */

/**
 * provide application error classes
 * @module errors
 */

var fs         = require('fs');
var _          = require('lodash');
var util       = require('util');
var inherits   = util.inherits;
var format     = util.format;
var extend     = util._extend;
var inspect    = util.inspect;
var debug      = require('debug')('ClientError');
var config     = require('../../config');
var lazyGetter = require('../../utils/lazy').lazyGetter;
var globalProperty = require('../../utils/globalProperty').globalProperty;

var errors = module.exports = {};
var clientFatalError;
var externalErrors = {};
lazyGetter(externalErrors, 'RejectionError', function () {
    return require('bluebird').RejectionError;
});
lazyGetter(externalErrors, 'MongoError', function () {
    return require('mongoose').Error;
});

/**
 * log error stack in the appropriate places
 * @param {(Error|string)} e
 */
function loge (e) {
    if (!(e instanceof Error)) {
        if ((typeof e === 'string') && (arguments.length > 1)) e = format.apply(null, arguments);
        e = new DeferredError(e);
        Error.captureStackTrace(e, loge);
    }

    if (debug.enabled) debug(e);
    else if (config.app.environment === 'development') console.log(e.stack);

    if (typeof AppLogger !== 'undefined') AppLogger.error(e);
}
globalProperty('loge', loge);

/**
 * check if given error is a ClientError
 * @param {Error} e
 * @returns {boolean} - true if known error
 */
function isKnownError (e) {
    if (!e) return false;
    if (errors[e.name] === undefined) return false;
    if (e instanceof ClientError) return true;
    return false;
}

function DeferredError (msg) {
    Error.call(this);
    if ((typeof msg === 'string')) this.message = msg;
    else this.message = inspect(msg);
}
inherits(DeferredError, Error);

/**
 * abstract ClientError class
 * @constructor
 * @param {(string|Object)} msg - error message
 * @param {Object} edesc - error description
 * @param {string} edesc.message - default error message
 * @param {number} edesc.statusCode - default status code
 * @param {number} edesc.customCode - default custom code
 * @throws {TypeError} JSON.stringify of circular object
 */
function ClientError (msg, edesc) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.status = this.statusCode = edesc.statusCode;
    this.customCode = edesc.customCode;
    this.errors = [];
    this._headers = {};

    if (!msg) this.message = edesc.message;
    else if (typeof msg === 'string') this.message = msg;
    else this.message = JSON.stringify(msg);
}
inherits(ClientError, Error);
ClientError.prototype.name = 'ClientError';

/**
 * add multiple errors to Error Object
 * @param {string|ClientError} msg error description or Error object
 * @param {number} [code=this.customCode] custom error code
 */
ClientError.prototype.push = function (msg, code) {
    if (msg && (errors[msg.name] !== undefined)) {
        this.errors = this.errors.concat(msg.errors);
        this.header(msg._headers);
        return this;
    }
    if (!msg ||
            ((msg instanceof externalErrors.MongoError) ||
             (msg instanceof externalErrors.RejectionError))) {
        var _internalError = new errors.Internal();
        this.errors = _internalError.errors;
        this.statusCode = _internalError.statusCode;
        return this;
    }
    if (typeof msg !== 'string') msg = JSON.stringify(msg);
    this.errors.push({'msg': msg, 'code': (code || this.customCode)});
    return this;
};

/**
 * add response headers for error
 * @param   {String|Object} k - header name or hash with header names and values
 * @param   {*} [v=''] - header value
 * @returns {ClientError}
 */
ClientError.prototype.headers =
ClientError.prototype.header = function (k, v) {
    if ((arguments.length === 1) &&
            (!Array.isArray(k)) &&
            (typeof k === 'object')) {
        extend(this._headers, k);
        return this;
    }
    this._headers[k] = (v || v === 0) ? String(v) : '';
    return this;
};

/**
 * convert Error Object to form required for response
 * @returns {Object} with 'body', 'headers', 'status' keys
 */
ClientError.prototype.toResponse = function () {
    var result = {
        'body': {'errors': this.errors},
        'headers': this._headers,
        'status': this.statusCode
    };
    return result;
};

/**
 * Factory to create new Errors
 * @param {String} ename - Error name
 * @param {Object} edesc - description of error
 */
function errorFactory(ename, edesc) {
    if ((!(edesc.statusCode)) && (!(edesc.customCode))) {
        throw new Error('Invalid error definition for ' + ename);
    }
    if (!(edesc.customCode)) {
        edesc.customCode = edesc.statusCode;
    }

    /**
     * custom Error constructor
     * @constructor
     * @extends ClientError
     */
    function CustomClientError (msg) {
        if (!(this instanceof CustomClientError))
            throw new Error(format('Invalid Error instantiation, use new %s()', ename));
        ClientError.call(this, msg, edesc);
        this.name = ename;
        return this.push(this.message, this.customCode);
    }
    inherits(CustomClientError, ClientError);
    CustomClientError.prototype.name = ename;
    return CustomClientError;
}

/** for when really bad things happen */
clientFatalError = errors.clientFatalError = errorFactory('clientFatalError', {'statusCode': 500});

/**
 * helper to create new errors and load to global errors
 * @param {Object} o
 */
function registerErrors(o) {
    if ((typeof o !== 'object') || (Array.isArray(o)))
        throw new clientFatalError('Invalid argument to registerErrors. Only accepts objects.');

    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            if (errors[i] !== undefined)
                throw new clientFatalError(i + ' already exists.');
            errors[i] = errorFactory(i, o[i]);
        }
    }
}

function loadErrorsFromFile(fileName) {
    if (fileName !== 'index.js')
        registerErrors(require('./' + fileName));
}
fs.readdirSync(__dirname).forEach(loadErrorsFromFile);

//additionally expose HTTP level errors by their status code
//e.g.: new errors['404']()
_.forOwn(require('./rest'), function (v, k) {
    errors[v.statusCode] = errors[k];
});

errors.loge           = loge;
errors.isKnownError   = isKnownError;
errors.ClientError      = ClientError;
errors.registerErrors = registerErrors;
errors.errorFactory   = errorFactory;
