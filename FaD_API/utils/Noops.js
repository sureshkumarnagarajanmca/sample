
/**
 * noop for filters
 * @returns {Boolean} returns True
 */
function noopfilter () {
    return true;
}
exports.noopfilter = noopfilter;

function noop () {
}
exports.noop = noop;

function noopParam(p1) {
    return p1;
}
exports.noopParam = noopParam;
