var settings = {};
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function loadSettings() {
    var files = fs.readdirSync(__dirname);

    files.forEach(function (file) {
        if (file.indexOf('.json') > -1) {
            var setting = fs.readFileSync(path.join(__dirname, file));
            var settingName = file.slice(0, -5);

            setting = JSON.parse(setting);
            settings[settingName] = setting;
        }
    });
}

function getSetting(name) {
    if (settings[name])
        return _.pick(settings, name);
    else
        return false;
}

exports.loadSettings = loadSettings;
exports.getSetting = getSetting;
