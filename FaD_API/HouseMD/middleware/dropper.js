var debug = require('debug')('DROPPER');

function dropper (opts) {
    if (!opts || !opts.enabled || !debug.enabled) {
        return function (req, res, next) {
            next();
        };
    }

    setInterval(function () {
        debug('DROPPER MIDDLEWARE HAS BEEN ENABLED');
    }, 10000);

    return function (req, res, next) {
        var rate = opts.rate / 100;
        //roll dice
        var reject = Math.random() < rate;
        if (reject) {
            debug('DROP', req.url);
            res.setHeader('DROPPER', 'DROPPED REQUEST');
            res.json('My responses are limited. You must ask the right questions.', 400);
            return;
        }
        next();
    };
}

module.exports = dropper;
