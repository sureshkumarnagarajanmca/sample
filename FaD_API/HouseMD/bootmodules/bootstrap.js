/**
 * @module bootstrap
 * loads dependencies into global scope
 * see http://nodejs.org/api/globals.html
 * initializes common dependencies
 */

require('../utils/promise.defer.js'); //add defer method
require('../utils/lodash_extns.js'); //add extensions to lodash

var debug;
var NODEFS = require('fs');
var globals = {};

globals.config = function(_config) {
    Object.defineProperty(global, 'config', {
        value: _config,
        writable: true,
        configurable: false,
        enumerable: true
    });
};

globals._appConsts = function() {
    Object.defineProperty(global, '_appConsts', {
        value: require('../appConstants'),
        writable: false,
        configurable: false,
        enumerable: true
    });
};

globals.appGlobals = function() {
    Object.defineProperty(global, 'appGlobals', {
        value: {},
        writable: true,
        configurable: false,
        enumerable: true
    });
};

globals.Logger = function() {
    //Initialize logger instance(s).
   require('../logger');
};

globals.ModelFactory = function() {
    var modelFactoryInst = require('../models/ModelFactory').getInst();
    Object.defineProperty(appGlobals, 'ModelFactory', {
        value: modelFactoryInst,
        writable: false,
        configurable: false,
        enumerable: true
    });

    modelFactoryInst.init();
};

globals.ContextProvider = function() {
    function UserContext(usrCtx) {
        this.getUserID = function() {
            return usrCtx.userId;
        };

        this.getOrganizationID = function() {
            return usrCtx.orgId;
        };

    }

    function ContextProvider(contextObj) {
        var _dataSource;

        if (contextObj) {
            _dataSource = contextObj.datasource;
        }

        this.setDatasource = function(datasource) {
            _dataSource = datasource;
        };

        this.getDatasource = function() {
            return _dataSource;
        };

        this.toJSON = function() {
            return contextObj;
        };

        this.getUserContext = function() {
            return new UserContext(contextObj);
        };

        this.getStorageContextInfo = function() {
            return contextObj.storageContext;
        };
    }

    ContextProvider.getInst = function(contextObj) {
        return new ContextProvider(contextObj);
    };

    Object.defineProperty(appGlobals, 'ContextProvider', {
        value: ContextProvider,
        writable: false,
        configurable: false,
        enumerable: true
    });
};

/*globals.qManager = function () {
    var koreQ = require('../services/KoreQ');

    Object.defineProperty(global, 'qManager', {
        value: koreQ,
        writable: false,
        configurable: false,
        enumerable: true
    });
};*/

function initiateDataBase() {
    var dbMgr = require(config.app.root + '/db/DBManager').getInst();

    dbMgr.initiateDB(function(err){
        if(err){
            process.exit(78);
        }
    });
    //Get Connection once on boot
    //dbMgr.getConnection();
}

function initEntityManager() {
    var _exportsMgrInst;
    _exportsMgrInst = require(config.app.root + '/data/EntityManager.js').getInst();
    _exportsMgrInst.init(config.app.root + '/data/entities');
    return _exportsMgrInst;
}
globals.initEntityManager = initEntityManager;

function initElasticsearch(callback) {
    var esMgr = require('../services/Elasticsearch/index.js');
    esMgr.init(callback);
}

function mountFADFS(mountPoint) {
    var _mountPoint, _mounted;

    _mountPoint = mountPoint || config.storage.FAD_FS_MOUNT;

    _mounted = NODEFS.existsSync(_mountPoint);

    if (!_mounted) {
        try {
            //@TODO : recursive directory creation, use mkdirp
            require('mkdirp').sync(_mountPoint);
        } catch (mountErr) {
            if (mountErr.code !== 'EEXIST') {
                console.error(mountErr.stack);
                console.error("unable to boot the app due to error mounting the Kore FS");
                process.exit(78);
            }
        }
    }
    console.log('FAD File System mounted');
}
globals.mountFADFS = mountFADFS;

/*
 * if(_program.filestore){
 *   _storageConfig.fileStore = require()
 * }
 *
 */

function initFileStore(storageConfig) {
    var fileStoreFactory, filestoreName, fileStoreConfig, fileStoreInst;

    fileStoreFactory = require(require('path').resolve(config.app.root, 'FileStore/FileStoreFactory.js'));

    filestoreName = storageConfig.defaultFileStore;
    fileStoreConfig = storageConfig.fileStores[filestoreName];

    fileStoreInst = fileStoreFactory.getTheStore(filestoreName, fileStoreConfig);

    return fileStoreInst;

}

function initStorageService(storageConfig) {
    var prefixProvider, storageService, storageServiceInst,
        fileStoreInst;

    storageConfig = storageConfig || config.storage;
    fileStoreInst = initFileStore(storageConfig);
    prefixProvider = storageConfig.prefixProvider;

    storageService = require(config.app.root + '/services/StorageService.js');
    storageServiceInst = storageService.getInst(fileStoreInst, prefixProvider);

    Object.defineProperty(appGlobals, 'StorageService', {
        value: storageServiceInst,
        writable: false,
        configurable: false,
        enumerable: true
    });
}
globals.StorageService = initStorageService;

function initImageResizeService(temp, resizeConfiguration) {
    var _imageResizerServiceInst, _temp, _resizeConfiguration;

    _temp = temp || config.app.root + '/temp'; // TODO : Constantize

    _resizeConfiguration = resizeConfiguration || config.thumbnail;

    _imageResizerServiceInst = require(config.app.root + '/services/ImageResizeService').getInst(_temp, _resizeConfiguration);

    Object.defineProperty(appGlobals, 'ImageResizeService', {
        value: _imageResizerServiceInst,
        writable: false,
        configurable: false,
        enumerable: true
    });
}

function initRegExs(regexs) {
    var _regexs = regexs || config.regex;
    var _keys = Object.keys(_regexs);
    var globalRegex = {};

    _keys.forEach(function(key) {
        globalRegex[key] = new RegExp(_regexs[key]);
    });

    Object.defineProperty(appGlobals, 'regex', {
        value: globalRegex,
        writable: false,
        configurable: false,
        enumerable: true
    });
}
globals.regex = initRegExs;

function prepareGlobalConstants(_globals) {
    //global constants have to be loaded in this order
    var globalConstants = [
        '_appConsts',
        'appGlobals',
        'Logger',
        'ContextProvider',
        //'mountKoreFS',
       // 'StorageService',
        //'regex',
       // 'qManager',
        //'ModelFactory',
       // 'initEntityManager'
    ];

    if (arguments.length !== 0) {
        debug('Loading all Globals');
        globalConstants = globalConstants.filter(function (i) {
            return (_globals.indexOf(i) > -1);
        });
    }

    globalConstants.forEach(function(constant) {
        if (global.constant) return;
        debug('loading', constant);
        globals[constant]();
    });
}

exports.init = function(conf) {
    //so we can enable debug via config.json
    require('./bootstrap.debug.js')(conf);

   // conf.errors = require(conf.errors);
   // conf.storage.prefixProvider = require(conf.storage.prefixProvider);
    globals.config(conf);

    debug = require('debug')('bootstrap');

    prepareGlobalConstants();
    //initiateDataBase();
   // initImageResizeService();
    //initElasticsearch();
};

exports.prepareGlobalConstants = prepareGlobalConstants;
exports.initStorageService = initStorageService;
exports.initImageResizeService = initImageResizeService;
