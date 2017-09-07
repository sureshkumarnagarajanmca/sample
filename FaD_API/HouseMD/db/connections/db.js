/**
 * Created by pradeep on 2/23/16.
 */
var mongoose = require('mongoose');

var config      = require('../../config');

//console.log(config);
module.exports = {
    _db: null,

    init: function() {
        if (!module.exports._db) {
            var path = 'mongodb://' + config.db.host + '/' + config.db.database;
            console.log('connecting to MONGO via ' + path);
            module.exports._db = mongoose.connect(path);
        }
        return module.exports._db;
    }
}