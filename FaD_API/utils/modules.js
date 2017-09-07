/**
 * utils to deal with modules
 */

var fs   = require('fs');
var path = require('path');

function addPrefixSlash (filename) {
    return './' + filename;
}

/**
 * load all modules in a directory
 * but skip any mentioned in second arg
 * @param {String} dirname
 * @param {String[]} skip - array of files to skip
 * @param {Object} module - the module object from calling file
 * @returns {Object[]} - array of required files
 */
function load (dirname, skip, module) {
    if (!Array.isArray(skip)) skip = [skip];

    function notInSkip (f) {
        if (skip.indexOf(f) < 0) return true;
        return false;
    }
    
    return fs.readdirSync(dirname)
            .filter(notInSkip)
            .map(addPrefixSlash)
            .map(module.require.bind(module));
}
exports.loadModules = load;

/**
 * shorthand to load all modules inside module folder except main
 * to be used by the main file of a folder when the folder is being required
 * @param {String} dirname
 * @param {Object} module - the module object from calling file
 * @returns {Object[]} - array of required files
 */
function loadFolder (dirname, module) {
    return load(dirname, path.basename(module.filename), module);
}
exports.loadFolder = loadFolder;
