/**
 * This function finds the length of an object literal
 *
 * @param obj
 * @returns length of Object literal
 */
function length(obj) {
    return Object.keys(obj).length;
}

function extendObject(objects, overwrite) {
    if (!Array.isArray(objects)) {
        throw "Expecting Array of objects as first argument for utils.extend method. Found an object"; // Am adding this because am always
        // passing objects instead of array
        // and spending time in debugging
        // the bug. Hate it.
    }
    var indx = 0,
        _object, _newObject = {}, _property = false;
    for (indx; indx < objects.length; indx += 1) {
        _object = objects[indx];
        for (_property in _object) {
            if (_object.hasOwnProperty(_property)) {
                if (overwrite || !_newObject.hasOwnProperty(_property)) {
                    _newObject[_property] = _object[_property];
                }
            }
        }
    }
    return _newObject;
}

function renameProperty(object, orgNams, newNames) {
    var _newObject = {}, _property = false,
        _orgNames, _newNames, _objInd;
    _orgNames = (!Array.isArray(orgNams)) ? [orgNams] : orgNams;
    _newNames = (!Array.isArray(newNames)) ? [newNames] : newNames;
    for (_property in object) {
        if (object.hasOwnProperty(_property)) {
            _objInd = _orgNames.indexOf(_property);
            if (_objInd > -1 && _objInd < _newNames.length) {
                _newObject[_newNames[_objInd]] = object[_property];
            } else {
                _newObject[_property] = object[_property];
            }
        }
    }
    return _newObject;
}

/**
 * This method parses the propertypath in the object and returns the mapping value
 *
 * @author  Naveen I
 *
 * @param object         - Object literal to inspect or Array of Object Literals
 * @param propertyPath   - Path to traverse in the object
 * @param startInd       - Strating Index of Array
 * @param treatAsArray   - Force Array
 * @return
 *          value|array   -   Mapped to the property path in the object;
 */
function getValue(object, propertyPath, startInd, treatAsArray) {
    if (!object || !propertyPath) {
        throw "Inavlid arguments";
    }

    function getVal(_objectToInspect) {
        var _obj = _objectToInspect,
            _ind = 0,
            propertyParts = propertyPath.split(".");
        for (_ind = 0; _ind < propertyParts.length; _ind += 1) {
            _obj = _obj[propertyParts[_ind]];
            if (!_obj) {
                break;
            }
        }
        return _obj;
    }

    if (Array.isArray(object) || treatAsArray) {
        var _indx = startInd,
            _valArr = [],
            _objectsArr = object;
        for (_indx = startInd; _indx < _objectsArr.length; _indx += 1) {
            _valArr.push(getVal(_objectsArr[_indx]));
        }
        return _valArr;
    } else {
        return getVal(object);
    }
}


/**
 * This method itertes through object properties and resturns Values as Array
 *
 * @author  Naveen I
 * @created 31-Oct-2012
 *
 * @param object  - Object literal to inspect or Array of Object Literals
 * @return
 *        array   - Array of values
 */
function getValuesAsArray(object) {
    var _prop, _values = [];

    for (_prop in object) {
        if (object.hasOwnProperty(_prop)) {
            _values.push(object[_prop]);
        }
    }
    return _values;
}

/**
 * This method generates Objects using the ObjectTemplate and Possible values for
 * each property
 *
 * @author  Naveen I
 *
 * @param objTemplate - Object literal to representing template to generate objects.
 * @param objValues   - Object literal representing Possible values.
 *                          ex: {name:['val-1','Val-2']}
 *                                  OR
 *                         Array of Object literal representing Possible values.
 *                          ex: [{
 *                                 name:'val-1'
 *                               },{
 *                                 name:'val-2'
                                 }]
 *
 * @param howMany     - Int
 *
 * @created 30-Oct-2012
 *
 * @return
 *          objsArry   -   Array of generated objects;
 *
 * @Note
 *
 *      ObjectTemplate and objValues can contain special values [$indx , $rand, $date]
 *
 * @limitation
 *      - Do not use this method to generate large sets (>10000).
 *      - Do not use for nested object
 *
 */
function getObject(objTemplate, objValues, howMany) {
    if (!objTemplate || !objValues) {
        throw "Inavlid Arguments";
    }
    var _count = howMany || 1,
        _ind, _objectsArray = [],
        _obj, _objProp, _availVal, _now,
        _objPropVal, _valObj;

    if (_count > 10000) {
        throw "Not allowed to generate more than 10000 objects";
    }

    for (_ind = 0; _ind < _count; _ind += 1) {
        _obj = {};
        for (_objProp in objTemplate) {
            if (objTemplate.hasOwnProperty(_objProp)) {
                _objPropVal = objTemplate[_objProp];
                if (Array.isArray(objValues)) {
                    _valObj = objValues[_ind];
                    if (_valObj && _valObj.hasOwnProperty(_objProp)) {
                        _obj[_objProp] = _valObj[_objProp];
                        _objPropVal = _obj[_objProp];
                    }
                } else {
                    if (objValues.hasOwnProperty(_objProp)) {
                        _availVal = objValues[_objProp];
                        if (Array.isArray(_availVal)) {
                            _availVal = _availVal[_ind];
                        }
                        _obj[_objProp] = _availVal;
                        _objPropVal = _obj[_objProp];
                    }
                }

                if ('string' === typeof _objPropVal) {
                    _now = new Date();
                    _objPropVal = _objPropVal.replace(/\$indx/ig, _ind).replace(/\$rand/ig, (_now.getTime() * (_ind + 1))).replace(/\$date/ig, _now);
                }

                _obj[_objProp] = _objPropVal;
            }
        }
        _objectsArray.push(_obj);
    }
    return _objectsArray;
}

/**
 * This method generates new clone from the object provided
 *
 * @author  Naveen I
 *
 * @param srcObj - Object literal to clone.
 * @param includeUndefined   - True if you want to clone undefined values
 *
 * @created 01-Mar-2013
 *
 * @return
 *          cloneObj   -   new Object cloned from source object
 *
 * @Note
 *      Circular reference objects causes program to hang
 *
 * @limitation
 *      - Do not use this method with circular referenced objects
 *
 */
function clone(srcObj, includeUndefined) {
    var _clone = {}, _prop, _val;
    for (_prop in srcObj) {
        if (srcObj.hasOwnProperty(_prop)) {
            _val = srcObj[_prop];
            if (includeUndefined || _val !== undefined) {
                if (Array.isArray(_val) || typeof _val === 'function' || typeof _val !== 'object') {
                    _clone[_prop] = _val;
                } else {
                    _clone[_prop] = clone(_val, includeUndefined);
                }
            }
        }
    }
    return _clone;
}

/**
 * This method copies properties from source object to destination object.
 *
 * @author  Naveen I
 *
 * @param srcObj - Object literal to copy.
 * @param destObj - Object literal to copyTo
 * @param includeUndefined   - True if you want to copy undefined values
 *
 * @created 01-Mar-2013
 *
 * @return
 *          destObj   -   destination object with modified property values
 * @Note
 *      Circular reference objects causes program to hang
 *
 * @limitation
 *      - Do not use this method with circular referenced objects
 *
 */
function copy(srcObj, destObj, includeUndefined) {
    var _prop, _val;
    for (_prop in srcObj) {
        if (srcObj.hasOwnProperty(_prop)) {
            _val = srcObj[_prop];
            if (includeUndefined || _val !== undefined) {
                if (Array.isArray(_val) || typeof _val === 'function' || typeof _val !== 'object') {
                    destObj[_prop] = _val;
                } else {
                    destObj[_prop] = copy(_val, ((typeof destObj[_prop] === 'object' && destObj[_prop]) || {}), includeUndefined);
                }
            }
        }
    }
    return destObj;
}

/**
 * This method performs set<PropName> / add<PropName> operation on 'obj' for each property
 * in 'props'
 * @param
 *      obj - Object containing set Methods
 * @param
 *      props - Object literal containing properties to set
 */
function ApplySetProperties(obj, props) {
    var _prop;
    for (_prop in props) {
        if (props.hasOwnProperty(_prop)) {
            if (obj["set" + _prop]) {
                obj["set" + _prop](props[_prop]);
            } else if (obj["add" + _prop]) {
                obj["add" + _prop](props[_prop]);
            } else if (obj["can" + _prop]) {
                obj["can" + _prop](props[_prop]);
            } else if (obj["is" + _prop]) {
                obj["is" + _prop](props[_prop]);
            }
        }
    }
}

/**
 * This method converts object to Query string Object
 *
 * @author  Naveen I
 *
 * @param srcObj - Object literal to copy.
 * @param includeUndefined   - True if you want to copy undefined values
 * @param destObj - Object literal to copyTo
 * @param prefix - String to prefix the value key
 *
 * @created 12-April-2013
 *
 * @return
 *          destObj   -   destination object with modified property values
 * @Note
 *      Circular reference objects causes program to hang
 *
 * @limitation
 *      - Do not use this method with circular referenced objects
 *
 */
function objectToQuery(srcObj, includeUndefined, destObj, prefix) {
    var _prop, _val, _destObj = destObj || {}, _prefix;

    if (prefix) {
        _prefix = prefix + '.';
    } else {
        _prefix = '';
    }

    for (_prop in srcObj) {
        if (srcObj.hasOwnProperty(_prop)) {
            _val = srcObj[_prop];
            if ((includeUndefined || _val !== undefined) && typeof _val !== 'function') {
                if (typeof _val === 'object' && !Array.isArray(_val) && _val.constructor !== Date) {
                    objectToQuery(_val, includeUndefined, _destObj, _prefix + _prop);
                } else {
                    _destObj[_prefix + _prop] = _val;
                }
            }
        }
    }
    return _destObj;
}

exports.extend = extendObject;
exports.len = length;
exports.renameProperty = renameProperty;
exports.getValue = getValue;
exports.getObject = getObject;
exports.getValuesAsArray = getValuesAsArray;
exports.clone = clone;
exports.copy = copy;
exports.set = ApplySetProperties;
exports.toQuery = objectToQuery;
