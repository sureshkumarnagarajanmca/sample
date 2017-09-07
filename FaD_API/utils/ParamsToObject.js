/**
 * This function contains the mappings to map HTTP request body parameter to
 * object literal required by functions.
 *
 */
var _mappings = {};

/**
 * Login Form Mappings
 */
_mappings.WelcomePage = {
    'email': 'emailId',
    'password': 'password'
};

/**
 * RequestInvite Form Mappings
 */
_mappings.RequestInvite = {
    'reqInvEmail': 'nonclientUserEmailId',
    'reqInvName': 'nonclientUserName'
};

_mappings.CreateAccount = {
    'fName': 'firstName',
    'lName': 'lastName',
    'pwd': 'password',
    'email': 'emailId',
    'clientId': 'clientId',
    'p_email': 'p_email',
    'p_phone': 'p_phone',
    'p_sms': 'p_sms',
    'verfKey': 'tokenCode',
    'phoneNo': 'phoneNo'
};

_mappings.EnrollFreeAccount = {
    'email': 'emailId',
    'fName': 'firstName',
    'lName': 'lastName',
    'cName': 'companyName',
    'pass': 'password',
    'cPass': 'confirmPassword',
    'jTitle': 'jobTitle',
    'dept': 'department',
    'p_phone': 'phone',
    'street': 'street',
    'suiteNo': 'suiteNo',
    'city': 'city',
    'state': 'state',
    'zip': 'zip',
    'country': 'country',
    'consent': 'consent',
    'upgrade': 'upgrade',
    'noOfUsers': 'maxUsers',
    'orgId': 'orgId',
    'rd': 'rd'
};

_mappings.EnrollPaidAccount = {
    'email': 'emailId',
    'fName': 'firstName',
    'lName': 'lastName',
    'cName': 'companyName',
    'jTitle': 'jobTitle',
    'dept': 'department',
    'p_phone': 'phone',
    'street': 'street',
    'suiteNo': 'suiteNo',
    'city': 'city',
    'state': 'state',
    'zip': 'zip',
    'country': 'country',
    'noOfUsers': 'maxUsers',
    'pass': 'password',
    'cPass': 'confirmPassword',
    'consent': 'consent',
    'orgId': 'orgId',
    'rd': 'rd'
};

_mappings.MultiMediaMessage = {
    'from': 'from',
    'to': 'to',
    'type': 'type',
    'path': 'path',
    'status': 'status'
};

_mappings.Search = {
    'query': 'searchString',
    'rp': 'recordsPerPage',
    'pn': 'pageNumber'
};
_mappings.MakeFrds = {
    'mi': 'memberId',
    'ui': 'userId'
};

_mappings.ManageFrds = {
    'mi': 'memberId',
    'act': 'action'
};

_mappings.SaveLocation = {
    'location': 'location'
};

_mappings.clientPackagedApps = {
    'marketing': 'marketing',
    'sales': 'sales',
    'crm': 'crm',
    'customerService': 'customerService'
};

/**
 * This function maps the request parameter's name to DB column's name
 */
function paramToObject(_mapName, _params) {
    var _paramName = false,
        _parsed = {}, _unParsed = {}, _map, _ref;
    if (_mappings.hasOwnProperty(_mapName) && typeof _params === 'object') {
        _map = _mappings[_mapName];
        /*jshint forin: true */
        for (_paramName in _params) {
            if (_params.hasOwnProperty(_paramName)) {
                _ref = (_map.hasOwnProperty(_paramName)) ? _parsed : _unParsed;
                _ref[_map[_paramName]] = _params[_paramName];
            }
        }
        /*jshint forin: false */
    }
    // TODO- return handle unparsed variables. But How?
    return (length(_parsed)) ? _parsed : _params;
}

/**
 * This function maps the request DB column's name to parameter's name
 */
function objectToParam(_mapName, _params) {
    // TODO - write reverse logic. Can you?
}

exports.p2o = paramToObject;
