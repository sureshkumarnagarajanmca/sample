/**
 * create deferred
 * compatibiltiy util for bluebird, since deferreds are deprecated
 *
 * suggested reference implementation from bluebird API docs
 */

var Promise = require('bluebird');

function defer() {
    var resolve, reject;
    var promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
exports.defer = defer;

//once the bluebird defer is completely removed
if (!Promise.defer) Promise.defer = defer;
