/**
 * @module Batch
 * service to process batch requests
 * TODO: move logic to nginx and stop using this
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var debug   = require('debug')('batch');
var _       = require('lodash');

var promiseutils  = require('../utils/promises');
var config        = require('../config');
var host          = config.app.host;

exports.host   = function (_host) {
    host = _host;
};

var methods = ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'];
exports.methods = methods;

function subRequestHeaders (req, sub) {
    var h = _.omit(req.headers, ['content-type', 'content-length', 'accept-encoding']);
    _.extend(h, sub.headers);
    return h;
}

function subRequest (req, sub) {
    sub.method = sub.method.toUpperCase();
    var opts = {
        'url'   : host + sub.url,
        'method': sub.method,
        'json': true,
        'headers': subRequestHeaders(req, sub)
    };

    if ((sub.method === 'POST') || (sub.method === 'PUT'))
        opts.json = sub.body;

    console.log('sub request', sub.method, sub.url);

    return request(opts)
        .spread(function (res, body) {
            var result = {
                'headers': res.headers,
                'status': res.statusCode,
            };
            if (body) result.body = body;
            return result;
        })
        .catch(function (err) {
            debug(err);
            return {
                'body': {
                    'errors': [ { 'msg': 'Internal Server Error', 'code': 500 } ]
                },
                'status': 500
            };
        });
}

/**
 * batch requests should be made as JSON
 * (similar to https://developers.facebook.com/docs/graph-api/making-multiple-requests/)
 * an array of sub-requests of the form
 *     [
 *         {
 *             'method': 'POST',
 *             'url': '/api/users/...',
 *             'headers': {
 *                  'Authorization': 'bearer 2802901568602'
 *              },
 *             'body': 'optional for POST/PUT'
 *         }
 *     ]
 *
 * responses are JSON array in same order as sub-requests
 *     [
 *         {
 *             'status': 400,
 *             'headers': {
 *                 'resource-error-description': {
 *                     'errors':[{'code':400,'msg':'Bad Request'}]
 *                 }
 *             },
 *             'body': 'Bad Request'
 *         }
 *     ]
 */
function handler (req, res) {
    var batchRequests = req.body;
    debug('processing batch request [subRequests:%s]', batchRequests.length);

    var batchPromises = batchRequests.map(_.partial(subRequest, req));

    promiseutils.extractFromSettled(batchPromises)
        .then(function (finalRes) {
            res.status(200).send(finalRes);
        })
        .catch(function (err) {
            debug(err);
            res.status(500).send({'errors': [ { 'msg': 'Internal Server Error', 'code': 500 } ]});
        });
}
exports.handler = handler;

function route () {
    var router = require('express').Router();
    var bodyParser = require('body-parser');
    router.use(bodyParser());
    router.use(handler);
    return router;
}
exports.route = route;
