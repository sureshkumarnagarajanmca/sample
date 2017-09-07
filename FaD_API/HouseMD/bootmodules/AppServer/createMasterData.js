
var log = {};
    /*ApplicationClients = require(config.app.root + '/db/dbScripts/seedScripts/ApplicationClients.js'),
    ProductFeatures = require(config.app.root + '/db/dbScripts/seedScripts/ProductFeatures.js'),
    License = require(config.app.root + '/db/dbScripts/seedScripts/Licenses.js'),
    DefaultAccount = require(config.app.root + '/db/dbScripts/seedScripts/DefaultAccountSetup.js'),
    Permissions = require(config.app.root + '/db/dbScripts/seedScripts/Permissions.js'),
    KoreGroups = require(config.app.root + '/db/dbScripts/seedScripts/KoreGroups.js'),
    SystemTemplates = require(config.app.root + '/db/dbScripts/seedScripts/Templates.js'),
    EntitleMents = require(config.app.root + '/db/dbScripts/seedScripts/Entitlements.js');*/

log.resource = 'SeedData';
log.action = 'Setup';
AppLogger.info('Seed Data setup initiated', log);


var seedFns = [

    ];

function init(fns, cb) {
    if (!fns) fns = seedFns;

    var i, ii = fns.length;
    var cbs = 0;

    function callback(err) {
        if (err) {
            console.log(err);
            console.log('exiting');
            if (cb && typeof cb === 'function') cb(err);
            else process.exit(1);
            return;
        }

        cbs++;

        if (cbs === ii) {
            console.log('completed');
            if (cb && typeof cb === 'function') cb(null);
            else process.exit(0);
            return;
        }
    }

    for (i = 0; i < ii; i++) {
        fns[i](callback);
    }
}

exports.init = init;
