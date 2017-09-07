/**
 *send matched route as header
 */

module.exports = function routeHeader (req, res, next) {

    var reqRoute;

    Object.defineProperty(req, 'route', {
        get: function () { return reqRoute; },
        set: function (_route) {
           // res.setHeader('X-Route', _route.path);
            reqRoute = _route;
        },
        configurable: true,
        enumerable: true
    });

    next();

};
