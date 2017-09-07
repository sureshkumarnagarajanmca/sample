var loggerconfig = require('../appConstants/loggerconfig.js');

var CommonLogger = require('./CommonLogger');

loggerconfig.components.forEach(function(component) {
    Object.defineProperty(global, component.name, {
        value: new CommonLogger(component),
        writable: false,
        configurable: true
    });
});