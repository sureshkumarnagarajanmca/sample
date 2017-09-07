/**
 * utils for promises
 */

var Promise = require('bluebird');

/**
 * for arrary of promises,
 * return a promise for values of all promises when they have settled
 * @param{[Promise]} - batchPromises
 * @returns {Promise}
 */
function extractFromSettled (batchPromises) {
    return Promise.settle(batchPromises)
        .map(function (i) {
            return i.isFulfilled() ? i.value() : i.error();
        });
}
exports.extractFromSettled = extractFromSettled;
