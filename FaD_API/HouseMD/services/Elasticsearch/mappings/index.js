var mappings = {};
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function loadMappings() {
    var files = fs.readdirSync(__dirname);

    files.forEach(function (file) {
        if (file.indexOf('.json') > -1) {
            var mapping = fs.readFileSync(path.join(__dirname, file));
            var mappingName = file.slice(0, -5);

            mapping = JSON.parse(mapping);
            mappings[mappingName] = mapping;
        }
    });
}

function getMapping(name) {
    var m;
    var mappingname;
    if (mappings[name]){
        m = _.pick(mappings, name);
        mappingname = m[name].mappingname;
        if(mappingname){
            delete m[name].mappingname;
            m[mappingname] = m[name];
            delete m[name];
        }
        return m;
    }
    else
        return false;
}

exports.loadMappings = loadMappings;
exports.getMapping = getMapping;
