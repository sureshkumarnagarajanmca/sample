var _ = require('lodash');

/**
 * Function that returns true if value is not `false`
 * @param {Object} val Any value
 * @return {Boolean} true if val is not false
 */
function isNotFalse(val) {
    return false !== val;
}
exports.isNotFalse = isNotFalse;

/**
 * Add enumerable properties of source to destination object
 * where property is undefined in destination
 * @param {Object} d destination Object
 * @param {Object} s source Object
 * @return {Object} returns the destination object
 */
function addDefaults(d, s) {
    if (_.isUndefined(s)) return;
    var sKeys;
    if (_.isObject(s)) sKeys = Object.keys(s);

    if (sKeys) {
        if (_.isUndefined(d)) d = {};
        sKeys.forEach(function(key) {
            d[key] = addDefaults(d[key], s[key]);
        });
    } else {
        if (!_.isUndefined(s))
            d = s;
    }

    return d;
}
exports.defaultsDeep = addDefaults;

_.mixin(exports);
