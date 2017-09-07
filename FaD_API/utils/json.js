/**
 * @module json
 * to parse json without throwing
 */

function parse (str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return err;
    }
}
exports.parse = parse;

function asyncParse (str, cb) {
    var res;
    try {
        res = JSON.parse(str);
    } catch (err) {
        return cb(err);
    }

    cb(null, res);
}
exports.asyncParse = asyncParse;
