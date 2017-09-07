/**
 * handles rest and service calls
 * and resolve response by service results
 * @module serviceHandler
 *
 * TODO: localeConverter?
 */

var errors = require('./errors');
//var debug = require('debug')('serviceHandler');
var Promise = require('bluebird');

/**
 * constructs response using successfull result of service
 * @param {*} serviceResult
 * @returns {Object} object with 'result' and success 'status'
 */
function constructResponse(serviceResult) {

    console.log("data");
    var result = {
        'body': (serviceResult && serviceResult.body) || serviceResult || null,
        'headers': (serviceResult && serviceResult.headers) || {},
        'status': 200
    };
    return result;
}

/**
 * helper to convert EventEmitter to promise
 * @param {EventEmitter} emmiter
 * @param {(string|string[])} successEvent
 * @param {(string|string[])} failEvent
 * @returns {Promise} promise resolved by emmiter
 */
function e2p (emmiter, successEvent, failEvent) {
    var defer = Promise.defer();

    function attachFailListener (fEvent) {
        emmiter.on(fEvent, defer.reject);
    }

    function attachSuccessListener (sEvent) {
        emmiter.on(sEvent, defer.resolve);
    }

    if (Array.isArray(successEvent)) successEvent.forEach(attachSuccessListener);
    else attachSuccessListener(successEvent);

    if (Array.isArray(failEvent)) failEvent.forEach(attachFailListener);
    else attachFailListener(failEvent);

    return defer.promise;
}

function safelySetHeaders(res, headers) {
    if (res.headersSent) return;

    res.header(headers);
}

/**
 * resolves an exception to appropriate response
 * @param {ClientError} e
 * @returns {Object} with 'body' and 'status' keys
 */
function constructErrorResponse(e) {
    if (!(e instanceof Error)) {
        console.warn('WARNING: Expecting Error, but got %s',
                JSON.stringify(e) || (e.toString && e.toString() || 'invalid argument'));
    }

    if ((errors[e.name] === undefined) || (e.name === 'clientFatalError') || !e.statusCode) {
        //something went really wrong?
        //log it and create sanitized `Internal Server Error`
        errors.loge(e);
        e = new errors.Internal();
    }
    var errResponse = e.toResponse();
    return errResponse;
}

/**
 * error handler - given an Error, respond appropriately
 * @param {Error} err - Error object
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function errorHandler(err, req, res) {
    var errResponse = constructErrorResponse(err);
    safelySetHeaders(res, errResponse.headers);
    res.status(errResponse.status)
       .send(errResponse.body);
}

/**
 * helper for rest api
 * resolves Promise returning services to json responses
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} req
 * @param {Promise} serviceP
 * @returns {Promise} promise to resolve service result to response
 */
function serviceHandler (req, res, serviceP) {

    return serviceP
        .then(constructResponse)
        .catch(constructErrorResponse)
        .then(function (result) {
            safelySetHeaders(res, result.headers);
            res.status(result.status).send(result.body);
        });
        //TODO: .catch and die?

}

/**
 * helper for rest api
 * resolves EventEmitting services to json responses
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {EventEmitter} serviceE - service that emits events
 * @param {String|String[]} successEvent(s)
 * @param {String|String[]} failEvent(s)
 * @returns {Promise} promise that handles response
 */
function serviceEventHandler (req, res, serviceE, successEvent, failEvent) {
    if (!successEvent || !failEvent)
        throw new errors.clientFatalError('Missing success or fail events');
    return serviceHandler(req, res, e2p(serviceE, successEvent, failEvent));
}

/**
 * callback interface for serviceHandler
 * returns a node-style callback that can be called with either:
 *  - cb(err)
 *  - cb(null, someValueTheUserWants);
 *
 * e.g.
 *      var cb = callbackHandler(req, res);
 *
 *      cb(new Error('plain js error');
 *      cb(new errors.BadRequest());  // see ./errors for custom errors
 *      cb(MongoError());
 *      cb(null, {'userids': [1, 2]});
 *      serviceInst.doSomeServiceAction(options, cb);
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @returns {Function} - node style callback
 */
function callbackHandler (req, res) {
    var defer = Promise.defer();
    serviceHandler(req, res, defer.promise);
    return defer.callback;
}


exports.serviceHandler         = serviceHandler;
exports.constructErrorResponse = constructErrorResponse;
exports.errorHandler           = errorHandler;
exports.serviceEventHandler    = serviceEventHandler;
exports.callbackHandler        = callbackHandler;
exports.e2p                    = e2p;
exports.errors                 = errors;
