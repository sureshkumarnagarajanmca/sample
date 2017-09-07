var fs = require('fs');
/**
 * Function to create a directory in recursive mode
 */
var mkdir_p = function(path, mode, callback, position){
    mode = mode || '0777';
    position = position || 0;
    var parts = require('path').normalize(path).split('/'),directory;

    if (position >= parts.length) {
        if (callback) {
            return callback();
        } else {
            return true;
        }
    }

    directory = parts.slice(0, position + 1).join('/');
    fs.stat(directory, function(err) {
        if (err === null) {
            mkdir_p(path, mode, callback, position + 1);
        } else {
            fs.mkdir(directory, mode, function (err) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    } else {
                        throw err;
                    }
                } else {
                    mkdir_p(path, mode, callback, position + 1);
                }
            });
        }
    });
};

exports.mkdir_p = mkdir_p;
