// global config
var request = require('request');
var util = require('util');
var esconfig = config.elasticsearch.instances.common;
var esapiUrl = util.format('http://%s:%s',esconfig.host, esconfig.port);

function Es() {
    //constructor
};

Es.prototype.executeQuery = function(options, callback) {
    
    var reqOptions = {
        url: esapiUrl + '/usage-logs*/_search',
        body: options.queryString
    };
    request.post(reqOptions, function(err, res, body) {
        try {
            if (typeof body === "string") {
                body = JSON.parse(body);
            }
        } catch (e) {
            err = "error in query response"
        }
        callback(err, body);
    });
};

Es.prototype.formatter = function(query, queryResult, callback) {
    var dimensions = query.dimensions || [];
    var metrics = query.metrics || [];

    delete query.securityFilters;
    delete query.event_filters;

    var result = {
        query: query,
        totalResults: 0,
        columnHeaders: dimensions.concat(metrics),
        rows: []
    };
    var cols = dimensions.concat(metrics);
    var colsCount = dimensions.length + metrics.length;
    var rows = [];
    var rowscount = 0;
    var ar = metrics.length + 1;
    var spIndex = (colsCount - ar);

    function flatten(root, row, m, prow) {
        if (root) {
            var buckets = root.buckets;
            if (buckets && buckets.length > 0) {
                for (var i = 0; i < buckets.length; i++) {
                    var b = buckets[i];
                    row.push(b['key_as_string'] || b.key);
                    for (var p in b) {
                        if (metrics.indexOf(p) >= 0 || dimensions.indexOf(p) >= 0) {
                            flatten(b[p], row, p, prow);
                        }
                    }
                }
            } else {
                row.push(root.value);
                if (m === metrics[metrics.length - 1]) {
                    rowscount++;
                    if (rows.length > 0) {
                        if (row.length > colsCount) {
                            ar = row.length - colsCount;
                            spIndex = colsCount - ar; 
                            row.splice(spIndex, ar);
                        }
                    }
                    
                    //console.log("FINAL ROW",JSON.stringify(row));
                    rows.push(JSON.parse(JSON.stringify(row)));
                    row = new Array();
                }
            }
        }
    }
    function flattenIfMetricsOnly(aggs){
        var row= [];
        for(var p in aggs){
            row.push(aggs[p].value);
        }
        rows.push(row);
    }

    if (dimensions.length > 0 && queryResult.aggregations) {
        flatten(queryResult.aggregations[dimensions[0]], []);
    } else if (metrics.length > 0 && queryResult.aggregations){
        flattenIfMetricsOnly(queryResult.aggregations);
    }

    result.totalResults = rows.length;
    result.rows = rows;
    callback(null, result);
};

module.exports = Es;