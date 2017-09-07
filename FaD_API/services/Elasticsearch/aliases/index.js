var aliases = {};
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function loadAliases() {
    var files = fs.readdirSync(__dirname);

    files.forEach(function (file) {
        if (file.indexOf('.json') > -1) {
            var alias = fs.readFileSync(path.join(__dirname, file));
            var aliasName = file.slice(0, -5);

            alias = JSON.parse(alias);
            aliases[aliasName] = alias;
        }
    });
}

function getAlias(name) {
    if (aliases[name])
        return _.pick(aliases, name);
    else
        return false;
}

exports.loadAliases = loadAliases;
exports.getAlias = getAlias;
