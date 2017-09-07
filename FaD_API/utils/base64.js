var stream = require('stream');
var Transform = stream.Transform;
var util = require('util');

/**
 * Escape base64 strings
 * @param {String} base64string the base64 string to escape
 * @return {String} escaped base64 string
 */
function escape(base64string) {
    var s = base64string.replace(/\//g, "_")
        .replace(/\+/g, "-")
        .replace(/[=]/g, "$");
    return s;
}
exports.escape = escape;

/**
 * Unescape base64 string
 * @param {String} escapedstring The escaped base64 string to unescape
 * @return {String} unescaped base64 string
 */
function unEscape(escapedstring) {
    var s = escapedstring.replace(/_/g, "/")
        .replace(/-/g, "+")
        .replace(/\$/g, "=");
    return s;

}
exports.unEscape = unEscape;

/**
 * Transforms base64 to buffer using the streams transform implementation
 * @constructor
 * @param {Object} options The options for the input and output streams
 */
function b64tob(options) {
    if (!(this instanceof b64tob))
        return new b64tob(options);

    Transform.call(this, options);

    this.body = '';
}

util.inherits(b64tob, Transform);

b64tob.prototype._transform = function (chunk, encoding, callback) {
    if (Buffer.isBuffer(chunk)) {
        this.body += chunk.toString();
    } else {
        this.body += chunk;
    }

    callback();
};

b64tob.prototype._flush = function(callback) {
    this.push(new Buffer(this.body, 'base64'));

    callback();
};
exports.b64tob = b64tob;
