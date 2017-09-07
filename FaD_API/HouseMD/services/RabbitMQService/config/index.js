var qs = require('./main/queues.js');
var es = require('./main/exchanges.js');
var defaults = require('./default.js');
var _ = require('lodash');

if(typeof(global.environment) !== 'undefined'){
    qs = require('./'+global.environment+'/queues.js');
    es = require('./'+global.environment+'/exchanges.js');
}

var qnames = Object.keys(qs);
var enames = Object.keys(es);

qnames.forEach(function (qname) {
    qs[qname] = _.defaultsDeep(qs[qname], defaults.queue);

    if (!qs[qname].exchanges) qs[qname].exchanges = {};
    qs[qname].exchanges.default = qname;
});

enames.forEach(function (ename) {
    es[ename] = _.defaultsDeep(es[ename], defaults.exchange);
});

module.exports = {
    queues: qs,
    exchanges: es
};
