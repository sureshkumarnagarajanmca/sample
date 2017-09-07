var uuidv5 = require('./uuidv5.js');
var uuidv4 = require('node-uuid').v4;

var config = require('../config');

var NAMESPACE_client = uuidv5.v5(uuidv5.NIL_UUID, config.app.APPLICATIONID);
exports.APPLICATIONID = NAMESPACE_client;

function createID(idprefix, namespace) {
    if ((!namespace) || (typeof namespace !== 'string'))
        namespace = uuidv5.NIL_UUID.toString();
    namespace = namespace.replace(/^.-/, '');
    return idprefix + '-' + uuidv5.v5(namespace, uuidv4());
}

exports.Organization = function () {
    return createID('o', NAMESPACE_client);
};

function IDGeneratorFactory (_prefix) {
    return function (parentns) {
        return createID(_prefix, parentns);
    };
}

function initIDGenerators (_idmap, _idgen) {
    Object.keys(_idmap).forEach(function (type) {
        exports[type] = _idgen(_idmap[type]);
    });
}

// map of ID type => id prefix
// add more entries for new types
var idmap = {
    User      : 'u',
    Thread    : 't',
    Message   : 'm',
    Group     : 'g',
    EGroup    : 'e',
    FileName  : 'f',
    SessionId : 's',
    Key       : 'k',
    Topic     : 'i',
    Post      : 'p',
    Comment   : 'c',
    Alert     : 'l',
    Stream    : 'st',
    Action    : 'a',
    Event     : 'v',
    Filter    : 'x',
    AAM       : 'w',
    SecretKey : 'y',
    Review    : 'r',
    Order     : 'o',
    Haraka    : 'h'
};

initIDGenerators(idmap, IDGeneratorFactory);
