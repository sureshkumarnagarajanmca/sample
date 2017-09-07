function _compare(a, b) {
    if (!a)  return -1;
    if (!b)  return 1;
    if (!a && !b) return 0;

    var _a = a.toLowerCase(),
        _b = b.toLowerCase();
    if (_a < _b) {
        return -1;
    } else if (_a > _b) {
        return 1;
    } else {
        return 0;
    }
}

/* author: Harsh
 *
 * Set of helper functions for array of objects
 */

/*
 * Insertion Sort.
 * Sorting algorithm for a nearly sorted array.
 *
 * @params: _arr - array to be sorted
 *          _sortBy - array of properties to be sorted by along with order
 *          uniqueBy - (optional) check for uniqueness of the property
 *
 * example call: arrayInsSort (Array, ['fistName+','lastName+'], 'userId')
 */
function arrayInsSort(_arr, sortBy, uniqueBy) {
    var _arrElement,
        i, j,
        _arrLength = _arr.length,
        _sortBy,
        _sort,
        _order,
        _tmpArr = [],
        _duplicates = [];

    if (_arrLength < 2) {
        return {
            array: _arr,
            duplicates: _duplicates
        };
    }

    if (arguments.length < 2 || sortBy.length < 1) {
        throw 'Insufficient Arguments';
    }

    for (i = 1; i < _arrLength; i += 1) {

        _sortBy = sortBy.slice(0);
        _sort = _sortBy.shift();
        _order = 1;
        if (_sort.slice(-1) === '-') {
            _order = -1;
        }
        _sort = _sort.substr(0, _sort.length - 1);

        _arrElement = _arr[i];
        j = i - 1;

        while (j >= 0) {
            if (_compare(_arr[j][_sort], _arrElement[_sort]) * _order === 1) {
                _arr[j + 1] = _arr[j];
                j = j - 1;
            } else if (_compare(_arr[j][_sort], _arrElement[_sort]) === 0) {
                if (_sortBy.length > 0) {
                    _tmpArr = arrayInsSort([_arr[j], _arrElement], _sortBy, uniqueBy);
                    if (_tmpArr.duplicates.length === 0) {
                        if (_tmpArr[0] === _arrElement) {
                            _arr[j + 1] = _arr[j];
                        } else {
                            break;
                        }
                    } else {
                        _duplicates = _duplicates.concat(_arr.splice(j, 1));
                        i -= 1;
                        _arrLength = _arr.length;
                    }
                } else {
                    if (uniqueBy !== undefined) {
                        if (_arr[j][uniqueBy] === _arrElement[uniqueBy]) {
                            _duplicates = _duplicates.concat(_arr.splice(j, 1));
                            i -= 1;
                            _arrLength = _arr.length;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                j -= 1;
            } else {
                break;
            }
        }

        _arr[j + 1] = _arrElement;
    }
    return {
        array: _arr,
        duplicates: _duplicates
    };
}
exports.arrInsertionSort = arrayInsSort;

/*
 * Helper function which is to be used with Array.sort
 * Takes a single property and sorts as per the order given.
 * example call: Array.sort(arrSortProp('firstName+')(a,b))
 */
function arrSortProp(_prop) {
    var _order = 1;

    if (_prop.slice(-1) === '-') {
        _order = -1;
    }

    _prop = _prop.substr(0, _prop.length - 1);

    return function(a, b) {
        return _compare(a[_prop], b[_prop]) * _order;
    };
}

/*
 * Function to sort an array of objects in random order
 * Takes the array to be sorted along with an array of properties to be sorted in the given order
 *
 * example call: arrQSort(Array, ['firstName+','lastName+'])
 */
function arrQSort(_arr, _sortBy) {
    var _len = _arr.length,
        _propLen = _sortBy.length;

    if (_len < 2) {
        return _arr;
    }

    _arr.sort(function(a, b) {
        var i = 0,
            result = 0;

        while (result === 0 && i < _propLen) {
            result = arrSortProp(_sortBy[i])(a, b);
            i += 1;
        }

        return result;
    });

    return _arr;
}
exports.arrQuickSort = arrQSort;

/*
 * Function to check whether passed element already exists in the array.
 */
function checkForDuplicates(_arr, _arrElement, _fieldName) {
    var i, ii;

    if (arguments.length < 3) {
        throw 'Insufficient Arguments';
    }

    for (i = 0, ii = _arr.length; i < ii; i++) {
        if (_arr[i][_fieldName] === _arrElement[_fieldName]) return true;
    }

    return false;
}
exports.checkForDuplicates = checkForDuplicates;

/*
 * Function to insert a new element into an already sorted array.
 * Uniqueness is maintained as per the provided parameter.
 * Returns array.
 */
function insertUniqueSorted(_arr, _arrElement, _sortBy, _uniqueBy) {
    if (arguments.length < 4) {
        throw 'Insufficient Arguments';
    }

    var i, _len = _arr.length;

    for (i = 0; i < _len; i += 1) {

        if (_arr[i][_uniqueBy] === _arrElement[_uniqueBy]) {
            return _arr;
        }

        if (_arr[i][_sortBy] > _arrElement[_sortBy]) {
            _arr.splice(i, 0, _arrElement);
        }
    }

    return _arr;
}

/*
 * Function to do the merging in the Merge Sort Algorithm.
 * The two arrays passed to it have to be independantly sorted.
 * example call: merge(leftArr, rightArr, ['firstName+','lastName+'], 'userId')
 *
 */
function merge(_leftObj, _rightObj, sortBy, uniqueBy) {
    var result = [],
        _left = _leftObj.array,
        _right = _rightObj.array,
        il = 0,
        ir = 0,
        _duplicates = [],
        _leftDuplicates = _leftObj.duplicates || [],
        _rightDuplicates = _rightObj.duplicates || [],
        _sortBy = sortBy.slice(0),
        _sort = _sortBy.shift(),
        _order = 1,
        _tmpArr = [];

    if (_left.length < 1) {
        return {
            array: _right,
            duplicates: _duplicates
        };
    }

    if (_right.length < 1) {
        return {
            array: _left,
            duplicates: _duplicates
        };
    }

    if ((arguments.length < 3) || (sortBy.length < 1)) {
        throw 'Insufficient Arguments';
    }

    if (_sort.slice(-1) === '-') {
        _order = -1;
    }

    _sort = _sort.substr(0, _sort.length - 1);

    if (_compare(_left[_left.length - 1][_sort], _right[0][_sort]) * _order === -1) {
        return {
            array: result.concat(_left).concat(_right),
            duplicates: _duplicates
        };
    } else if (_compare(_left[0][_sort], _right[_right.length - 1][_sort]) * _order === 1) {
        return {
            array: result.concat(_right).concat(_left),
            duplicates: _duplicates
        };
    }

    while (il < _left.length && ir < _right.length) {
        if (_compare(_left[il][_sort], _right[ir][_sort]) * _order === -1) {
            result.push(_left[il]);
            il += 1;
        } else if (_compare(_left[il][_sort], _right[ir][_sort]) * _order === 1) {
            result.push(_right[ir]);
            ir += 1;
        } else {
            if (_sortBy.length > 0) {
                _tmpArr = merge({
                    array: [_left[il]]
                }, {
                    array: [_right[ir]]
                }, _sortBy, uniqueBy);
                result.push(_tmpArr.array[0]);
                if (_tmpArr.duplicates.length === 0) {
                    result.push(_tmpArr.array[1]);
                } else {
                    _duplicates.push(_tmpArr.duplicates[0]);
                }
            } else {
                if (uniqueBy !== undefined) {
                    if (_left[il][uniqueBy] === _right[ir][uniqueBy]) {
                        result.push(_left[il]);
                        _duplicates.push(_right[ir]);
                    } else {
                        result.push(_left[il]);
                        result.push(_right[ir]);
                    }
                } else {
                    result.push(_left[il]);
                    result.push(_right[ir]);
                }
            }
            il += 1;
            ir += 1;
        }
    }

    return {
        array: result.concat(_left.slice(il)).concat(_right.slice(ir)),
        duplicates: _duplicates.concat(_rightDuplicates).concat(_leftDuplicates)
    };
}
exports.arrMergeSorted = merge;

/*
 * Function to split a given array and call merge on it.
 * This function applies the Merge Sort algorithm on the passed array.
 *
 * example call: mergeSort (array, ['firstName+','lastName-'], 'userId')
 *
 */
function mergeSort(arr, sortBy, uniqueBy) {

    var _result, _arr, _middle, _left = {}, _right = {};

    if (Array.isArray(arr)) {
        _arr = arr;
        _left.duplicates = [];
        _right.duplicates = [];
    } else {
        _arr = arr.array;
        _left.duplicates = [];
        _right.duplicates = arr.duplicates;
    }

    if (_arr.length < 2) {
        return {
            array: _arr,
            duplicates: []
        };
    }

    _middle = Math.floor(_arr.length / 2);
    _left.array = _arr.slice(0, _middle);
    _right.array = _arr.slice(_middle);

    _result = merge(mergeSort(_left, sortBy, uniqueBy), mergeSort(_right, sortBy, uniqueBy), sortBy, uniqueBy);

    return {
        array: _result.array,
        duplicates: _result.duplicates.concat(_left.duplicates).concat(_right.duplicates)
    };
}
exports.arrMergeSort = mergeSort;

/**
 * This function slices the array to skip and limit given to it
 */

function arrSkipLimit(_arr, _skip, _limit) {
    var _len = _arr.length;

    _skip = +_skip;
    _limit = +_limit;

    if (_len < _skip) {
        return [];
    } else if (_len < _limit) {
        _limit = _len;
    }
    return _arr.slice(_skip, _skip + _limit);
}
exports.arrSlice = arrSkipLimit;

/**
 * Works only with primitive arrays
 *
 * @param origin - original array
 * @param subset - subset of origin
 * @returns [[],[]] - [[intersection of origin & subset],
 *     [difference of origin & subset]]
 */
function filterArray(origin, subset) {
    var result = [[],[]];
    var i = origin.length;

    while (i--) {
        if (subset.indexOf(origin[i]) >= 0) {
            result[0].push(origin[i]);
        } else {
            result[1].push(origin[i]);
        }
    }

    return result;
}
exports.filterArray = filterArray;

function orderOneByTheOther(arr1, arr2, fieldMapping) {
    var i, j, len1, len2, result = [],
        _fM, _cond;

    if (!Array.isArray(arr1) && !Array.isArray(arr2) &&
        arr1.length !== arr2.length && !fieldMapping) {
        return undefined;
    }

    len1 = arr1.length;
    len2 = arr2.length;

    for (i = 0; i < len1; i += 1) {
        if (fieldMapping === true) {
            _fM = Object.keys(arr1[i])[0];
        } else {
            _fM = fieldMapping;
        }

        for (j = 0; j < len2; j += 1) {
            if (fieldMapping === true) {
                _cond = arr1[i][_fM] === arr2[j][_fM];
            } else {
                _cond = arr1[i] === arr2[j][_fM];
            }

            if (_cond) {
                result.push(arr2[j]);
                //arr2.splice(j, 1);
                //len2 -= 1;
                break;
            }
        }

        if (j === len2) {
            result.push(arr1[i]);
        }
    }

    return result;
}

exports.orderOneByTheOther = orderOneByTheOther;

/**
 * toLowerCase  == toLowerCaseArray : this function convert array "strings" element data in lowercase
 * @param  {[type]} arr [array of string]
 * @return {[type]}     [description]
 */
function toLowerCase(arr) {
    var arrNew=[];
    if (!arr)  return arr;
    if (Array.isArray(arr)) {
        arr.forEach(function(a){
            arrNew.push( typeof a ==='string'?a.toLowerCase():a); 
        });
    }else{
        arrNew = arr.toLowerCase();
    }
    return arrNew;
}

exports.toLowerCaseArray = toLowerCase;
