/* Resource Endpoints*/
var parse = require('url').parse;

function ResourceEndpoints() {
    this.endpoints = {};
}

function pathRegexp(path, keys, sensitive, strict) {
    /*ignore jslint start*/
    if (path instanceof RegExp) return path;
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional) {
            keys.push({
                name: key,
                optional: !! optional
            });
            slash = slash || '';
            return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    /*ignore jslint end*/
}


ResourceEndpoints.prototype = {
    add: function(method, path, options) {
        method = method.toLowerCase();

        var keys = [],
            errmsg,
            route = {
                path: path,
                regexp: pathRegexp(path, keys, false, false),
                options: options
            }, self = this;
        route.keys = keys;

        ['get', 'post', 'put', 'delete'].forEach(function(m) {
            if (self.endpoints[m]) {
                self.endpoints[m].forEach(function(r) {
                    if (r.options.resource === route.options.resource && r.options.action === route.options.action) {
                        errmsg = "Found duplicate resource action";
                        AppLogger.fatal(errmsg, route.options);
                        throw new Error(errmsg);
                    }
                });
            }
        });

        (this.endpoints[method] = this.endpoints[method] || []).push(route);
    },
    match: function(req) {
        var method = req.method.toLowerCase(),
            url = parse(req.originalUrl),
            path = url.pathname,
            routes = this.endpoints,
            captures, route, keys, i=0;

        if (req.endpoint) {
            return req.endpoint;
        }

        // pass HEAD to GET routes
        if ('head' === method) method = 'get';

        // routes for this method
        routes = this.endpoints[method];
        if (routes) {

            // matching routes
            for (var len = routes.length; i < len; ++i) {
                route = routes[i];
                captures = route.regexp.exec(path);
                if (captures) {
                    keys = route.keys;
                    route.params = [];

                    // params from capture groups
                    for (var j = 1, jlen = captures.length; j < jlen; ++j) {
                        var key = keys[j - 1],
                            val = 'string' === typeof captures[j] ? decodeURIComponent(captures[j]) : captures[j];
                        if (key) {
                            route.params[key.name] = val;
                        } else {
                            route.params.push(val);
                        }
                    }

                    // all done
                    req.endpoint = route;
                    return route;

                }
            }
        }
    }
};

module.exports = new ResourceEndpoints();
