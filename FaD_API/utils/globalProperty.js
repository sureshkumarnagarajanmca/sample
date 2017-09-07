/**
 * @module utils/globalProperty
 * define properties on global object, to allow global access
 */

exports.globalProperty = function (prop_name, prop_value) {
    Object.defineProperty(global, prop_name, {
        value: prop_value,
        writable: false,
        configurable: false,
        enumerable: true
    });
};
