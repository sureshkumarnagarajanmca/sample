/*
 * This base class should be inherited in all the models.
 * It exposes all the CRUD operations returning either a callback if passed or a Promise.
 */

var Promise = require('bluebird');
var errors = config.errors;
var debug = require('debug')('basemodel');
var EntityManager = require('../data/EntityManager.js').getInst();
var AbstractEntity = require('../data/entities/AbstractEntity.js').AbstractEntity;
var NS = 'DB';
var utils = require('../utils');

function getJSONFromRec(rec) {
    if (rec.toJSON) return rec.toJSON();
    if (rec._id && rec._id.toString) rec._id = rec._id.toString();
    return rec;
}

function getJSONsFromRecs(recs) {
    recs = (Array.isArray(recs)) ? recs : [recs];
    return recs.map(getJSONFromRec);
}

function loadEntityFromRec(rec) {
    var _entity = EntityManager.getEntityInst(this.entityName);
    return _entity.load(NS, getJSONFromRec(rec));
}

function loadEntitiesFromRecs(recs) {
    recs = (Array.isArray(recs)) ? recs : [recs];
    return recs.map(loadEntityFromRec, this);
}

function serializeEntity(entity) {
    if (entity instanceof AbstractEntity) return entity.serialize(NS);
    else return entity;
}

function serializeEntities(entities) {
    return entities.map(serializeEntity);
}

function addCreatedOn(rec) {
    if (!rec.cO) rec.cO = utils.normalizedDate();
    rec.lMod = rec.cO;
}

function getIdArray(recs, idField) {
    recs = Array.isArray(recs) ? recs : [recs];

    var resultArr = [];
    var i, ii = recs.length;

    for (i = 0; i < ii; i++) {
        resultArr.push(recs[i][idField]);
    }

    return resultArr;
}

function BaseModel() {
    if (!this.modelName) throw new Error('No modelName');

    this.getJSONFromRec = getJSONFromRec;
    this.getJSONsFromRecs = getJSONsFromRecs;
    this.getIdArray = getIdArray;

    if (this.entityName) {
        this.loadEntityFromRec = loadEntityFromRec.bind(this);
        this.loadEntitiesFromRecs = loadEntitiesFromRecs.bind(this);
        this.serializeEntity = serializeEntity;
        this.serializeEntities = serializeEntities;
    }

    this.setModelProvider = function(modelProvider) {
        this.modelProvider = modelProvider;
    };

    this.getModel = function() {
        if (!this.modelProvider || !this.modelName) {
            throw new Error('no model provider');
        }
        return this.modelProvider.getModel(this.modelName);
    };
}

BaseModel.prototype.toString = function() {
    return this.modelName;
};

/**
 * Create operation.
 * @param {Array} recs The array of documents to be inserted into the DB
 * @param {Boolean} [loadToEntities=false] Set to true if the result should be return as an entity
 * @param {Function} [cb] The callback to call on completion
 * @return {Promise} A promise of completion
 * @throws
 *      DBError
 *      Duplicate
 */
BaseModel.prototype.create = function(recs, loadToEntities, cb) {
    var _model = this.getModel();
    var self = this;
    var postProcessingFn, multi;
    var _recs;

    if (arguments.length === 2) {
        if (typeof loadToEntities === 'function') {
            cb = loadToEntities;
            loadToEntities = false;
        }
    }

    multi = Array.isArray(recs);
    
    if (multi) {
        _recs = recs.map(function(rec) {
            var _rec;
            _rec = serializeEntity(rec);
            addCreatedOn(_rec);
            return _rec;
        });
    } else {
        _recs = serializeEntity(recs);
        addCreatedOn(_recs);
    }

	loadToEntities = (arguments.length >= 2 && this.entityName) ? loadToEntities : false;

    postProcessingFn = (loadToEntities) ? 
        (multi) ? self.loadEntitiesFromRecs : self.loadEntityFromRec :
        (multi) ? self.getJSONsFromRecs : self.getJSONFromRec;

    return new Promise(function (resolve, reject) {
        _model.create(_recs, function (err) {
            var recs;

            if (err) {
                if (err.code === 11000) {
                    debug(self.toString(), 'create duplicate', err);
                    reject(new errors.Duplicate(err));
                } else {
                    debug(self.toString(), 'create err', err);
                    reject(new errors.DBError(err));
                }
            } else {
                if (!multi) recs = arguments[1];
                else recs = Array.prototype.slice.call(arguments, 1);
                resolve(postProcessingFn(recs));
            }
        });
    }).nodeify(cb);
};

/**
 * Distinct Operation. Returns array of distinct values of that field.
 * @param {String} field The field whose values are to be got
 * @param {Object} matchCnd The query to take a subset against
 * @param {Function} [cb] The fn to be called on completion
 */
BaseModel.prototype.distinct = function(field, matchCnd, cb) {
    var argslength = arguments.length;

    if (argslength < 1) {
        throw new Error('Invalid Arguments');
    } else if (argslength < 3) {
        if (typeof matchCnd === 'function') {
            cb = matchCnd;
            matchCnd = undefined;
        }
    }

	var _model = this.getModel();
    var self = this;

    return new Promise(function (resolve, reject) {
        _model.distinct(field, matchCnd, function (err, values) {
            if (err) {
                debug(self.toString(), 'distinct err', err);
                reject(new errors.DBError(err));
            } else {
                resolve(values);
            }
        });
    });
};

/**
 * Find operation
 * @param {Object} matchCnd The query to search against
 * @param {Object} [projections] The fields which are to be returned
 * @param {Object} [options] find operation options
 * @param {Boolean} [loadToEntites=false] The resultset should be loaded to entities or not. this MUST have the 'entityName' property
 * @param {Function} [cb] The fn to be called on completion
 * @return {Promise} The promise of found records
 * @throws
 *      DBError
 */
BaseModel.prototype.find = function(matchCnd, projections, options, loadToEntities, cb) {
    var argslength = arguments.length;

    if (argslength < 1) {
        throw new Error('Invalid Arguments');
    } else if (argslength < 3) {
        if (typeof projections === 'function') {
            cb = projections;
            projections = undefined;
        }
        loadToEntities = false;
    } else if (argslength < 4) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        loadToEntities = false;
    } else if (argslength < 5) {
        if (typeof loadToEntities === 'function') {
            cb = loadToEntities;
            loadToEntities = false;
        }
    }

    if (!this.entityName)
        loadToEntities = false;

	var _model = this.getModel();
    var self = this;

    return new Promise(function (resolve, reject) {
        _model.find(matchCnd, projections, options).lean().exec(function (err, recs) {
            if (err) {
                debug(self.toString(), 'find err', err);
                reject(new errors.DBError(err));
            } else {
                if (recs.length === 0) 
                    resolve([]);
                else
                    resolve((loadToEntities) ? self.loadEntitiesFromRecs(recs) : self.getJSONsFromRecs(recs));
            }
        });
    }).nodeify(cb);
};

/**
 * Find single record
 *
 * @param {Object} matchCnd Condition to search by
 * @param {Object} [projection] The fields to be returned
 * @param {Boolean} [loadToEntity=false] Boolean stating if to be loaded to entity
 * @param {Function} [cb] The function to be called on completion
 * @return {Promise} The Promise of finding one record
 */
BaseModel.prototype.findOne = function(matchCnd, projection, loadToEntity, cb) {
    return this.find(matchCnd, projection, undefined, loadToEntity)
        .then(function (recs) {
            if (recs.length > 1) return Promise.reject(new errors.DBError('Too many results for findOne'));
            return recs[0];
        }).nodeify(cb);
};

/**
 * The Update operation. It automatically adds the lastModified(lMod) field to documents.
 * @param {Object} matchCnd Query against which the updateSet is decided
 * @param {Object} updateArgs The updates to be done to the updateSet. Mongo modifiers MUST be present
 * @param {Object} [options] Update options (upsert, multi)
 * @param {Function} [callback] The fn to be called on completion
 * @return {Promise} The promise of update complete
 * @throws
 *      DBError
 *      Duplicate
 *      RecordNotFound
 */
BaseModel.prototype.update = function(matchCnd, updateArgs, options, callback) {
    var _model = this.getModel();
    var self = this;

    return new Promise(function (resolve, reject) {
        if (!updateArgs) {
            reject(new errors.DBError('gimme something'));
            return;
        }

        // add last modified date to document
        if (updateArgs.$set) {
            updateArgs.$set.lMod = utils.normalizedDate();
        } else {
            updateArgs.$set = {lMod : utils.normalizedDate()};
        }

        _model.update(matchCnd, updateArgs, options, function (err, nA, upsertData) {
            if (err) {
                if (err.code === 11000) {
                    debug(self.toString(), 'update duplicate', err);
                    reject(new errors.Duplicate(err));
                } else {
                    debug(self.toString(), 'update err', err);
                    reject(new errors.DBError(err));
                }
            } else {
                if (nA < 1) {
                    reject(new errors.RecordNotFound());
                } else {
                    if (!upsertData.updatedExisting) {
                        resolve({upserted:upsertData.upserted[0]._id});
                    } else {
                        resolve(nA);
                    }
                }
            }
        });
    }).nodeify(callback);
};

/**
 * Remove Operation
 * @param {Object} matchCnd The query marking records for deletion
 * @param {Function} [callback] The fn to be called on completion
 * @return {Promise} The promise of operation completed
 * @throws
 *      DBError
 *      RecordNotFound
 */
BaseModel.prototype.remove = function(matchCnd, callback) {
    var _model = this.getModel();
    var self = this;

    return new Promise(function (resolve, reject) {
        _model.remove(matchCnd, function (err, nD) { //err, numDeleted
            if (err) {
                debug(self.toString(), 'remove err', err);
                reject(new errors.DBError(err));
            } else {
                if (nD < 1) {
                    reject(new errors.RecordNotFound());
                } else {
                    resolve(nD);
                }
            }
        });
    }).nodeify(callback);
};

/**
 * Count Operation
 * @param {Object} matchCnd query for which the count should happen
 * @param {Function} [callback] The fn to be called on completion
 * @return {Promise} The promise of the count of the input query
 * @throws
 *      DBError
 */
BaseModel.prototype.count = function(matchCnd, callback) {
    var _model = this.getModel();
    var self = this;

    return new Promise(function(resolve, reject) {
        _model.count(matchCnd, function(err, cnt) {
            if (err) {
                debug(self.toString(), 'count err', err);
                reject(new errors.DBError(err));
            } else {
                resolve(cnt);
            }
        });
    }).nodeify(callback);
};

/**
 * Updates one document matched by the given condition and returns that document.
 * If the condition matches multiple documents then the first document is updated.
 *
 * @param {Object} matchCnd The criteria by which the document should be updated
 * @param {Object} updateArgs The update object
 * @param {Object} [options] Key-Value having `sort` and `select` keys
 *                  [new=true] - {Boolean} returns updated document
 *                  [upsert=false] {Boolean} insert new record if matchCnd doesn't match any
 *                  [sort] - {Object} having the fields to sort by
 *                  [select] - {Object} projection for the returned document
 * @param {Boolean} [loadToEntities=false] Set this to true if a entity is to be returned
 * @param {Function} [callback] The Function to be called on completion
 * @return {Promise} Promise of a record thats been deleted
 *
 * @throws
 *      DBError
 *      RecordNotFound
 */
BaseModel.prototype.findOneAndUpdate = function(matchCnd, updateArgs, options, loadToEntities, callback) {
    var _model = this.getModel();
    var self = this;
    var argsLen = arguments.length;

    if (argsLen < 2) {
        throw new Error('Insufficient Arguments');
    } else if (argsLen < 4) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }
        loadToEntities = false;
    } else if (argsLen < 5) {
        if (typeof loadToEntities === 'function') {
            callback = loadToEntities;
            loadToEntities = false;
        }
    }

    if (!this.entityName)
        loadToEntities = false;

    return new Promise(function (resolve, reject) {
        _model.findOneAndUpdate(matchCnd, updateArgs, options, function (err, rec) {
            if (err) {
                if (err.code === 11000) {
                    debug(self.toString(), 'findOneAndUpdate duplicate', err);
                    reject(new errors.Duplicate(err));
                } else {
                    debug(self.toString(), 'findOneAndUpdate err', err);
                    reject(new errors.DBError(err));
                }
            } else {
                if (rec)
                    resolve((loadToEntities) ? self.loadEntityFromRec(rec) : self.getJSONFromRec(rec));
                else
                    reject(new errors.RecordNotFound());
            }
        });
    }).nodeify(callback);
};

/**
 * Removes one document matched by the given condition and returns that document.
 * If the condition matches multiple document then the first document is removed.
 *
 * @param {Object} matchCnd The criteria by which the document should be removed
 * @param {Object} [options] Key-Value having `sort` and `select` keys
 *                  [sort] - {Object} having the fields to sort by
 *                  [select] - {Object} projection for the returned document
 * @param {Boolean} [loadToEntities=false] Set this to true if a entity is to be returned
 * @param {Function} [callback] The Function to be called on completion
 * @return {Promise} Promise of a record thats been deleted
 *
 * @throws
 *      DBError
 *      RecordNotFound
 */
BaseModel.prototype.findOneAndRemove = function(matchCnd, options, loadToEntities, callback) {
    var _model = this.getModel();
    var self = this;
    var argsLen = arguments.length;

    if (argsLen < 3) {
        if (typeof options === 'function') {
            callback = options;
            options = undefined;
        }
        loadToEntities = false;
    } else if (argsLen < 4) {
        if (typeof loadToEntities === 'function') {
            callback = loadToEntities;
            loadToEntities = false;
        }
    }

    if (!this.entityName)
        loadToEntities = false;

    return new Promise(function (resolve, reject) {
        _model.findOneAndRemove(matchCnd, options, function (err, rec) {
            if (err) {
                debug(self.toString(), 'findOneAndRemove err', err);
                reject(new errors.DBError(err));
            } else {
                if (rec)
                    resolve((loadToEntities) ? self.loadEntityFromRec(rec) : self.getJSONFromRec(rec));
                else
                    reject(new errors.RecordNotFound());
            }
        });
    }).nodeify(callback);
};

/**
 * Finds documents based on the given condition, runs the given fn against the result and depending on the result
 * updates the document.
 *
 * Use with caution as this doesn't handle possible race conditions.
 *
 * @param {Object} matchCnd The criteria by which the document to be updated is selected
 * @param {Object} updateArgs The update arguments
 * @param {Promise|Function} checkCallback The callback fn to be run against the returned document
 * @param {Object} [options={}] The options for find and update combined
 *                  [sort] {Object} The sort criteria
 *                  [select] {Object} The projection of the document to return
 *                  [upsert=false] {Boolean} If true inserts new document if no records found
 *                  [multi=false] {Boolean} If true updates multiple documents
 * @param {Boolean} [loadToEntities=false] If true returns an entity
 * @param {Function} [callback] The function to call on completion
 * @return {Promise} Promise of completing update
 * @throws
 *      DBError
 *      RecordNotFound
 */
BaseModel.prototype.getCheckAndUpdate = function(matchCnd, updateArgs, checkCallback, options, loadToEntities, callback) {
    var self = this;
    var argsLen = arguments.length;
    var findP;

    if (argsLen < 3) {
        throw new Error('Insufficient Arguments');
    } else if (argsLen < 4) {
        loadToEntities = false;
        options = {};
    } else if (argsLen < 5) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
    } else if (argsLen < 6) {
        if (typeof loadToEntities === 'function') {
            callback = loadToEntities;
            loadToEntities = false;
        }
        options = {};
    } else {
        options = {};
    }

    if (!(checkCallback instanceof Promise) && (typeof checkCallback !== 'function'))
        throw new Error('Invalid checker type');

    var findOpts = {};
    if (options.sort) findOpts.sort = options.sort;
    if (options.skip) findOpts.skip = options.skip;
    if (options.limit) findOpts.limit = options.limit;

    findP = self.find(matchCnd, options.select, findOpts, loadToEntities);

    return findP
        .then(checkCallback)
        .then(function() {
            var updateOpts = {upsert: !!options.upsert, multi: !!options.multi};

            return self.update(matchCnd, updateArgs, updateOpts);
        })
        .return(findP).nodeify(callback);
};

module.exports = BaseModel;
