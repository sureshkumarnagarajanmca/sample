var daos = require('./daos.js')(),
    querygenerator = require('./querygenerator');

var daoMapping = {
    "es": "Es"
};


/**
 * @desc generate query and executes in the respective dao and returns dao specific response
 *
 * @method executeQuery
 * @param {Object} queryInput object
 *      example: queryInput= {
                                dimensions: ['date', 'account'],
                                metrics: ['users', newUsers],
                                start_date: null,
                                end_date: null,
                                sort: null

                            }
 * 
 * @param {function} callback callback to execute after query execution
 */
function executeQuery(queryInput, callback) {
    var query = querygenerator.generate(queryInput);
    if (!query) {
        callback('Invalid query');
        return;
    }

    daos[daoMapping[query.ds]].executeQuery({
        queryString: query.queryString
    }, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        try {
            var queryResult = daos[daoMapping[query.ds]].formatter(queryInput, res, function(err, queryResult) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, queryResult);
            });
        } catch (e) {
            callback('Invalid query');
        }
    });
}

module.exports.executeQuery = executeQuery;