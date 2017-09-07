/**
 *
 *
 * @Date:
 *
 */

var defaultGenerator = {
    generate: function() {
        return (new Date().valueOf() + new Date().valueOf());
    }
},
    cache = false;

function TokenService(authcodegenerator, accesstokengenerator, refreshtokengenerator) {
    var _arglength = arguments.length,
        _authcodegenerator, _accesstokengenerator, _refreshtokengenerator;

    if (_arglength === 0) {
        _authcodegenerator = _accesstokengenerator = _refreshtokengenerator = defaultGenerator;
    }

    if (_arglength === 1) {
        _authcodegenerator = _accesstokengenerator = _refreshtokengenerator = authcodegenerator;
    }

    if (_arglength === 2) {
        _authcodegenerator = authcodegenerator;
        _accesstokengenerator = _refreshtokengenerator = accesstokengenerator;
    }

    if (_arglength === 3) {
        _authcodegenerator = authcodegenerator;
        _accesstokengenerator = accesstokengenerator;
        _refreshtokengenerator = refreshtokengenerator;
    }

    function _generateAuthcode() {
        if (_authcodegenerator && _authcodegenerator.generate) {
            return _authcodegenerator.generate();
        }
        throw new Error('auth code generator must have a generate method');
    }

    function _generateAccesstoken() {
        if (_accesstokengenerator && _accesstokengenerator.generate) {
            return _accesstokengenerator.generate();
        }
        throw new Error('access token generator must have a generate method');
    }

    function _generateRefreshtoken() {
        if (_refreshtokengenerator && _refreshtokengenerator.generate) {
            return _refreshtokengenerator.generate();
        }
        throw new Error('refresh token generator must have a generate method');
    }

    this.generateToken = function(type) {
        if (!type) {
            return _generateAuthcode();
        }

        if (type === 'auth') {
            return _generateAuthcode();
        }

        if (type === 'access') {
            return _generateAccesstoken();
        }

        if (type === 'refresh') {
            return _generateRefreshtoken();
        }
    };
}

module.exports = function() {
    if (!cache) {
        cache = new TokenService();
    }
    return cache;
};
