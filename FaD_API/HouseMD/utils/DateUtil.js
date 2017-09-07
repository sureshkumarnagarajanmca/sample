
/**
 * helper to normalize dates sent to / received from client
 * since the format might not have ms precision
 * @param {Date} [d=new Date]
 * @returns {Date}
 */
function normalizedDate(d) {
    if (!(d instanceof Date)) d = new Date();
    return d.setMilliseconds(0), d;
}
exports.normalizedDate = normalizedDate;

/**
 * try parsing a string to Date
 * @param {String} dateString - string that maybe a date
 * @returns {Date|undefined}
 */
function getDate(dateString) {
    var parsedDate = Date.parse(dateString);
    if (isNaN(parsedDate)) {
        return undefined;
    }
    return normalizedDate(new Date(parsedDate));
}
exports.getDate = getDate;

/**
 * check if string is a valid lastModifiedDate
 * and return Date object for it
 * @param {String} datestring
 * @returns {Date|false}
 */
function validLastmodified(datestring) {
    var lastModifiedDate = getDate(datestring);
    var currentDate = new Date();
    if (!lastModifiedDate || (currentDate < lastModifiedDate)) {
        return false;
    }
    return lastModifiedDate;
}
exports.validLastmodified = validLastmodified;

/**
 * extract lastModified from header
 * @params {req} http req
 * @returns {Date|false}
 */
function extractLastModified(req) {
    return validLastmodified(req.header('If-Modified-Since'));
}
exports.extractLastModified = extractLastModified;

/**
 * get a infinite expires date
 * @return {Date} date 11 months from now
 */
function getInfiniteExpiresDate() {
    var eDate = normalizedDate();
    eDate.setFullYear(eDate.getFullYear(), 11 + eDate.getMonth());

    return eDate.toUTCString();
}
exports.getInfiniteExpiresDate = getInfiniteExpiresDate;
