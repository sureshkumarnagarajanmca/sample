var daos = {},
    fs = require('fs'),
    path = require('path');

function initialize() {
    function capitalize(str) {
        return str && str[0].toUpperCase() + str.slice(1);
    }
    fs.readdirSync(path.join(__dirname, 'dao')).forEach(function(file) {
        var dao = file.replace('.js', ''),
            name = capitalize(dao);
        daos.__defineGetter__(name, function() {
            return new(require('./dao/' + dao))
        });
    });
    return daos;
}

module.exports = initialize;