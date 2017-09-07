var util = require('util'),
    logicalModel = require('../logicalmodel.js'),
    _ = require('lodash');

function setQueryMeta(query, prop, value) {
    if (query[prop].indexOf(value) <= -1) {
        query[prop].push(value);
    }
}

function prepareQueryFilter(query) {
    var qfilters = [];
    if (query.start_date && query.end_date) {
        qfilters.push({
            "range": {
                "@timestamp": {
                    "gte": query.start_date,
                    "lte": query.end_date
                }
            }
        });
    }
    for (var p in query.event_filters) {
        var filter = {};
        filter[p] = query.event_filters[p];
        if (Array.isArray(query.event_filters[p])) {
            qfilters.push({
                "terms": filter
            });
        } else {
            qfilters.push({
                "term": filter
            });
        }
    }
    query.qfilters = qfilters;
}


function prepareESQuery(query) {
    var aggsQuery = {};

    function prepareMetrics(aggs) {
        if (query.metrics.length > 0) {
            aggs["aggs"] = aggs["aggs"] || {};
        }
        query.metrics.forEach(function(m) {
            aggs["aggs"][m.name] = {};
            aggs["aggs"][m.name][m.type] = {
                field: m.field
            }
        });

    }

    function prepareDimensions(aggs, dims) {
        if (dims.length > 0) {
            aggs["aggs"] = aggs["aggs"] || {};
            aggs["aggs"][dims[0].name] = {};
            aggs["aggs"][dims[0].name][dims[0].dstype] = {
                field: dims[0].field,
                format: dims[0].format,
                interval: dims[0].interval
            };
            var nextAgg = aggs["aggs"][dims[0].name];
            dims.shift();
            if (dims.length > 0) {
                prepareDimensions(nextAgg, dims);
            } else {
                prepareMetrics(nextAgg);
            }
        } else {
            aggs["aggs"] = aggs["aggs"] || {};
            prepareMetrics(aggs);
        }
    }

    prepareDimensions(aggsQuery, query.dimensions);
    return aggsQuery;
}

function parseQuery(queryInput) {
    if (queryInput.datasource.length > 1) {
        return false;
    }
    if (queryInput.datasource[0] === "es") {
        var aggs = prepareESQuery(queryInput);

        var query = {
            query: {
                filtered: {
                    filter: {
                        and: {
                            filters: queryInput.qfilters
                        }
                    }
                }
            },
            aggs: aggs.aggs
        };
        var q = {
            ds: "es",
            queryString: JSON.stringify(query)
        }

        delete queryInput.qfilters;
        return q;
    }
    return;
}

function getQuery(queryInput) {
    var query = {
        datasource: [],
        groups: [],
        dimensions: [],
        metrics: [],
        event_filters: {},
        securityFilters: queryInput.securityFilters || [],
        qfilters: [],
        filters: [],
        start_date: queryInput.start_date,
        end_date: queryInput.end_date,
        sort: queryInput.sort,
        start_index: 0
    };
    if (queryInput.dimensions) {
        queryInput.dimensions.forEach(function(d) {
            var dimension = logicalModel.dimensions[d];
            setQueryMeta(query, "datasource", dimension.datasource);
            _.merge(query.event_filters, dimension.event_filters)
            query.dimensions.push(dimension);
        });
    }
    if (queryInput.metrics) {
        queryInput.metrics.forEach(function(m) {
            var metric = logicalModel.metrics[m];
            setQueryMeta(query, "datasource", metric.datasource);
            _.merge(query.event_filters, metric.event_filters)
            query.metrics.push(metric);
        });
    }
    _.merge(query.event_filters, query.securityFilters)
    prepareQueryFilter(query);
    // console.log(query)
    delete query.event_filters;
    delete query.securityFilters;

    return parseQuery(query);
}

module.exports = {
    generate: getQuery
};