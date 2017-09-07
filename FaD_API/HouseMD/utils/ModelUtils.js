var objectId = require('mongoose').Types.ObjectId;

function extractId(rec) {
    return rec._id.toString();
}

function extractIds(recs) {
    return recs.map(extractId);
}

/**
 * @param {Array} ids - array of possible mongo ObjectIds
 * @returns {Boolean|Array} valid ObjectIds or false
 */
function validObjectIds(ids) {
    if (!Array.isArray(ids)) ids = [ids];
    try {
        ids = ids.map(objectId);
    } catch (e) {
        return false;
    }
    return ids;
}

exports.validObjectIds = validObjectIds;
exports.extractId = extractId;
exports.extractIds = extractIds;
