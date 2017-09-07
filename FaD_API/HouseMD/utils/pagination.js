var dateUtil = require('./DateUtil.js');

/**
 * Returns the limit passed unless it crosses the defaultLimit
 *
 * @param {Number} limit The actual limit
 * @param {Number} defaultLimit The max/default limit
 * @return {Number} The calculated limit
 */
function getLimit(limit, defaultLimit) {
    defaultLimit = +defaultLimit;
    limit = +limit;

    if (!defaultLimit && !limit)
        return;
    else if (!defaultLimit)
        return limit;
    else if (!limit)
        return defaultLimit;
    else if (limit > defaultLimit)
        return defaultLimit;
    else
        return limit;
}
exports.getLimit = getLimit;

/**
 * This function returns the resultArr with the skip and limit and returns
 * the sliced arr with a flag if more records are available
 *
 * @param {Array} resultArr The array to apply the flag to
 * @param {Number} skip The number of records to skip
 * @param {Number} limit The number of records requested. The resultArr should
 *          have one more record than expected
 * @param {String} resultArrKey The key to put for the result array. Defaults to 'resultArr'
 * @return {Object} hash with resultArrKey and moreAvailable
 */
function paginationFlag(resultArr, skip, limit, resultArrKey) {
    var _skip, _limit, _result = {};

    _limit = +limit || resultArr.length;
    _skip = +skip || 0;
    resultArrKey = resultArrKey || 'resultArr';

    if (limit) {
        if (resultArr.length > _limit) {
            _result.moreAvailable = true;
        } else {
            _result.moreAvailable = false;
        }
    }

    _result[resultArrKey] = resultArr.slice(0, _limit);

    return _result;
}
exports.paginationFlag = paginationFlag;

/**
 * Returns the opts object for get calls
 *
 * @param {String} queryOpts The opts object from the request (query params)
 * @param {String} module The module name from which to take the config from
 * @return {Object} the opts object with the validated parsed values from queryOpts
 */
function parseOptions(queryOpts, module) {
    var _opts = {};

    if (config[module]) {
        _opts.skip = queryOpts.offset || config[module].DEFAULT_SKIP;
        _opts.limit = getLimit(queryOpts.limit, config[module].DEFAULT_LIMIT) + 1;
    }

    _opts.since = dateUtil.getDate(queryOpts.since);

    return _opts;
}
exports.parseOptions = parseOptions;
