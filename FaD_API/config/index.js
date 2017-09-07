/**
 * @module config
 * exports a configuration object with all required configurations
 * configuration schemas are loaded from ./configs
 * if ./clientConfig.json exists, it will be used to override default values
 * see ./clientConfig.json.sample for sample
 */

var convict = require('convict');
var path    = require('path');
var fs      = require('fs');
var cluster = require('cluster');
var uriTemplate = require('uri-templates');

/**
 * noop for convict formatter
 * if no formatting is needed for a format type
 */
function noop () {
}

/**
 * resolve relative path to absolute path from clientServer root dir
 * @param {String} relativePath
 * @returns {String} absolute path
 */
function pathLoader (relativePath) {
    return path.join(__dirname, '..', relativePath);
}

/**
 * create RegExp from string
 */
function regexCompiler (regexString) {
    return new RegExp(regexString);
}

function templatesLoader(name){
    return fs.readFileSync(pathLoader('/Client/layouts' + name), 'utf8');
}

//follows the RFC6570(http://tools.ietf.org/html/rfc6570)
function uriTemplateLoader(template) {
    return new uriTemplate(template);
}

convict.addFormat('path', noop, pathLoader);
convict.addFormat('regex', noop, regexCompiler);
convict.addFormat('template', noop, templatesLoader);
convict.addFormat('uri-template', noop, uriTemplateLoader);

var conf = convict(path.join(__dirname, 'configs'));

var configfile = conf.get('app.configfile');

if (fs.existsSync(configfile)) {
    conf.loadFile(configfile);
    console.info('clientserver: config loaded from %s', configfile);
} else {
    console.info('clientserver: no config file found at %s', configfile);
}

// create baseURL for application
// if app.port is 3000, assume proxy running on port 80
var host = conf.get('app.protocol') + "://" +
        conf.get('app.hostname') +
        ((conf.get('app.port') === 3000) ?
         "" : (":" + conf.get('app.port')));
conf.set('app.host', host);
conf.set('app.baseURL', host + '/');
conf.set('app.service', conf.get('app.serviceName') + '/' + conf.get('app.commit').slice(0,7));

//create helper config objects from existing config
/*Object.keys(conf.get('uploads.fileContext')).forEach(function(context) {
    //concat all fileExtns for each filetype in uploads.conf
    conf.set('uploads.fileContext.' + context + '.fileExtns',
        conf.get('uploads.fileContext')[context].fileType.reduce(function(extns, type) {
            return extns.concat(conf.get('uploads.fileType.' + type));
        }, [])
    );

    //create hash map of the each extn to its filetype for easy lookup
    conf.set('uploads.fileContext.' + context + '.fileExtnMap',
        conf.get('uploads.fileContext')[context].fileType.reduce(function (extns, type) {
            conf.get('uploads.fileType')[type].forEach(function (extn) {
                extns[extn] = type;
            });
            return extns;
        }, {})
    );
});*/

//no clustering on windows (bug in nodejs cluster module on windows)
if (process.platform === 'win32') 
    conf.set('app.noCluster', true);

if ((conf.get('app.workerCount') === 0) &&
        (conf.get('app.noCluster') === false)) {
    conf.set('app.workerCount', '1');
   // conf.set('app.workerCount', require('os').cpus().length);
}

//set debug variables, ENV variables have highest priority
if (conf.get('app.debug')) {
    if (process.env.DEBUG) conf.set('app.debug', process.env.DEBUG);
    else process.env.DEBUG = conf.get('app.debug');

    require('debug').enable(conf.get('app.debug'));

    if (cluster.isMaster) {
        console.log('WARN: debug enabled (should not be used in production)');
        console.log('WARN: debugging', conf.get('app.debug'));
    }

    if (conf.get('app.environment') === 'production')
        console.warn('WARNING: DEBUG HAS BEEN ENABLED IN PRODUCTION');
}

conf.validate();

conf = conf._instance;
module.exports = conf;
