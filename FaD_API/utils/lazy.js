/**
 * helpers to be lazy
 */

/**
 * clear any existing value of obj[prop] and use new value
 * @param {Object} obj
 * @param {String} prop - property name
 * @param {*} val - new value of obj[prop]
 */
function fixValue (obj, prop, val) {
    delete obj[prop];
    obj[prop] = val;
    return obj;
}

/**
 * add getter function for an object
 * and change to regular property access on first access
 * @param {Object} obj
 * @param {String} prop - property name
 * @param {Function} func - idempotent function to resolve value of property
 */
function lazyGetter (obj, prop, func) {
    Object.defineProperty(obj, prop, {
        configurable: true,
        get: function () {
            var result = func();
            fixValue(obj, prop, result);
            return result;
        }
    });
}

exports.lazyGetter = lazyGetter;
