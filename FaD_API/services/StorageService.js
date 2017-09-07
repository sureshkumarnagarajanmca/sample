var theInstance, FileStore, File, StorageContext, NODE_PATH, ContextProvider;
// var ModelFactory = appGlobals.ModelFactory;
var PassThrough = require('stream').PassThrough;
ContextProvider = appGlobals.ContextProvider;
FileStore = require('../FileStore/FileStore.js');
File = FileStore.File;
StorageContext = FileStore.StorageContext;

NODE_PATH = require('path');

function ensureCallBack(cb) {
    if (typeof cb !== 'function') {
        return function() {};
    }
    return cb;
}

function isPath(filePath) {
    return (typeof filePath === 'string') ? true : false;
}

function prepareFileInst(theFileInfo) {
    var ispath, fileInst;

    ispath = isPath(theFileInfo);

    function ifIsPath() {
        var fileName, extn;
        extn = NODE_PATH.extname(theFileInfo);
        fileName = NODE_PATH.basename(theFileInfo, extn);

        return new File({
            'completePath': theFileInfo,
            name: fileName,
            extn: extn
        });
    }
    fileInst = ispath ? ifIsPath() : new File(theFileInfo);
    return fileInst;
}

function UploadContext() {
    var fileName;

    this.getFileName = function() {
        return fileName;
    };

    this.setFileName = function(toSetFileName) {
        fileName = toSetFileName;
    };
}

function MessageComponentUploadContext(component) {
    var uploadContext;
    var filename;
    UploadContext.call(this);

    uploadContext = 'MESSAGE';

    this.getContextName = function() {
        return uploadContext;
    };

    this.getMessageID = function() {
        //var _msgId;
        //_msgId = (component && component.getMessageID) ? component.getMessageID() : 'media';
        return 'media';
    };

    filename = (component.getFileName && component.getFileName()) || (component.filename);

    this.setFileName(filename);
}

function ProfileUploadContext(teamId) {
    var uploadContext;

    uploadContext = 'PROFILE';

    UploadContext.call(this);

    this.getContextName = function() {
        return uploadContext;
    };

    this.getTeamId = function() {
        if (teamId)
            return teamId;
        else
            return false;
    };
}

function ThumbnailUploadContext(thumbnailSize) {
    var uploadContext;

    uploadContext = 'THUMBNAIL';

    UploadContext.call(this);

    this.getContextName = function () {
        return uploadContext;
    };

    this.getThumbnailSize = function () {
        return thumbnailSize;
    };
}

function OrganizationUploadContext() {
    var uploadContext;

    uploadContext = 'ORG';

    UploadContext.call(this);

    this.getContextName = function() {
        return uploadContext;
    };
}

function StorageService(fileStore, prefixProvider) {
    var emptyPrefix;

    emptyPrefix = '';

    if ((!fileStore || !fileStore.putFile) || (prefixProvider && !prefixProvider.getThePrefix)) {
        throw new Error("missing the required arguments");
    }

    function getThePrefix(uploadContext, contextProvider, pathSep) {
        var thePrefix;

        if (prefixProvider) {
            thePrefix = prefixProvider.getThePrefix(uploadContext, contextProvider, pathSep);
        }
        return thePrefix || emptyPrefix;
    }

    function preparePrefixArray(unixFilePath) {
        return unixFilePath.split('/');
    }

    //PUT
    this.putFile = function(theFileInfo, uploadContext, contextProvider, putCallBack) {
        var thePrefix, storageContext, fileInst, toSetFileName;

        putCallBack = ensureCallBack(putCallBack);
        fileInst = prepareFileInst(theFileInfo);

        thePrefix = getThePrefix(uploadContext, contextProvider, fileStore.pathSeparator());

        storageContext = new StorageContext(contextProvider.getStorageContextInfo());
        storageContext.setPrefix(thePrefix);
        toSetFileName = uploadContext.getFileName();

        if (toSetFileName) {
            storageContext.setFileName(toSetFileName);
        }
        fileStore.putFile(fileInst, storageContext, putCallBack);
    };

    this.putMessageComponent = function(theFileInfo, contextProvider, component, callBack) {
        var uploadContext;

        uploadContext = new MessageComponentUploadContext(component);
        this.putFile(theFileInfo, uploadContext, contextProvider, callBack);
    };

    this.putProfilePic = function(theFileInfo, contextProvider, teamId, callBack) {
        var uploadContext;
        uploadContext = new ProfileUploadContext(teamId);

        this.putFile(theFileInfo, uploadContext, contextProvider, callBack);
    };

    this.putThumbnail = function(theFileInfo, contextProvider, thumbnailSize, callBack) {
        var uploadContext;

        uploadContext = new ThumbnailUploadContext(thumbnailSize);
        this.putFile(theFileInfo, uploadContext, contextProvider, callBack);
    };

    this.putMessageAttachment = function(theFileInfo, contextProvider, message, callBack) {
        var uploadContext;

        uploadContext = new MessageComponentUploadContext(message);
        this.putFile(theFileInfo, uploadContext, contextProvider, callBack);
    };

    this.putOrgFile = function(theFileInfo, contextProvider, callBack) {
        var uploadContext;

        uploadContext = new OrganizationUploadContext();
        this.putFile(theFileInfo, uploadContext, contextProvider, callBack);
    };

    //GET
    this.getFile = function(filePath, contextProvider, locateCallBack) {
        var prefixArray, storageContext, fileName, needExtndInfo;

        prefixArray = preparePrefixArray(filePath);
        fileName = prefixArray.pop();
        needExtndInfo = true;

        storageContext = new StorageContext(contextProvider.getStorageContextInfo());
        storageContext.setPrefix(prefixArray);

        fileStore.getFile(fileName, storageContext, locateCallBack, {
            extndInfo: true
        });
    };

    this.createReadStream = function(filePath, contextProvider , options) {
        var prefixArray, storageContext, fileName, needExtndInfo;

        options = options || {};
        prefixArray = preparePrefixArray(filePath);
        fileName = prefixArray.pop();
        needExtndInfo = true;

        storageContext = new StorageContext(contextProvider.getStorageContextInfo());
        storageContext.setPrefix(prefixArray);

        return fileStore.createReadStream(fileName, storageContext , options);
    };

    this.createComponentReadStream = function(msgcomponent, contextprovider , options) {
        var self = this;
        var filerec , filemodelinst;
        var filename , ext;
        var uploadcontext;
        var fileid;

        var passthrough = new PassThrough();
        uploadcontext = new MessageComponentUploadContext(msgcomponent);
        fileid = msgcomponent.componentFileId;
        filemodelinst = appGlobals.ModelFactory.getFilesModel(contextprovider);

        filemodelinst.getFile(fileid)
        .then(function(rec){
            var msgid;
            var readstream;
            filerec = rec.serialize('DB');
            msgid = 'media'; // this should be removed once clientFileSytem updates temp with msgId;
            ext = filerec.fE;
            filename = filerec.fN + '.' + ext;
            msgcomponent.filename = filename;
            var fileprefix = self.getMediaPrefix(contextprovider, msgcomponent);
            var filepath = fileprefix.join('/') + '/' + filename;
            readstream = self.createReadStream(filepath , contextprovider);
            readstream.on('data' , function(data){passthrough.write(data)});
            readstream.on('end' , function(data){passthrough.end(data)});
            // readstream.pipe(passthrough);
        })
        .catch(function (err){
            console.log(err);
            // callback(err,'Invalid FileId');
        });
        return passthrough;
    };

    this.filestat = function(filePath, contextProvider, statCallBack, options) {
        var prefixArray, storageContext, fileName, needExtndInfo;

        prefixArray = preparePrefixArray(filePath);
        fileName = prefixArray.pop();
        needExtndInfo = true;

        storageContext = new StorageContext(contextProvider.getStorageContextInfo());
        storageContext.setPrefix(prefixArray);

        fileStore.stat(fileName, storageContext, statCallBack, options);
    };

    //COPY
    function inputVariance(arg) {
        if (!arg || !(arg && arg.uploadContext && arg.contextProvider)) {
            return false;
        }

        return true;
    }

    function copyFnInputVariance(src, dest) {
        if (inputVariance(src) && inputVariance(dest)) {
            return true;
        }
        return false;
    }

    this.copy = function(src, dest, copyCallBack) {
        var srcUploadContext, destUploadContext;
        var srcCxtPvder, destCtxPvder;
        var srcPrefix, srcStorageContext, destPrefix, destStorageContext;
        var srcFileName, destFileName;

        if (!copyFnInputVariance(src, dest)) {
            copyCallBack(new Error('insufficient args'));
            return;
        }
        copyCallBack = ensureCallBack(copyCallBack);

        srcUploadContext = src.uploadContext;
        destUploadContext = dest.uploadContext;

        srcCxtPvder = src.contextProvider;
        destCtxPvder = dest.contextProvider; // || src.contextProvider;

        srcPrefix = getThePrefix(srcUploadContext, srcCxtPvder);
        destPrefix = getThePrefix(destUploadContext, destCtxPvder);

        srcStorageContext = new StorageContext(srcCxtPvder.getStorageContextInfo());
        destStorageContext = new StorageContext(destCtxPvder.getStorageContextInfo());

        srcStorageContext.setPrefix(srcPrefix);
        destStorageContext.setPrefix(destPrefix);

        srcFileName = srcUploadContext.getFileName();
        destFileName = destUploadContext.getFileName() || srcFileName;

        srcStorageContext.setFileName(srcFileName);
        destStorageContext.setFileName(destFileName);

        fileStore.copy(srcStorageContext, destStorageContext, copyCallBack);

    };


    this.move = function(src, dest, mvCallBack) {
        var srcUploadContext, destUploadContext;
        var srcCxtPvder, destCtxPvder;
        var srcPrefix, srcStorageContext, destPrefix, destStorageContext;
        var srcFileName, destFileName;

        if (!copyFnInputVariance(src , dest)) {
            mvCallBack(new Error('insufficient args'));
            return;
        }
        mvCallBack = ensureCallBack(mvCallBack);

        srcUploadContext = src.uploadContext;
        destUploadContext = dest.uploadContext;

        srcCxtPvder = src.contextProvider;
        destCtxPvder = dest.contextProvider; // || src.contextProvider;

        srcPrefix = getThePrefix(srcUploadContext, srcCxtPvder);
        destPrefix = getThePrefix(destUploadContext, destCtxPvder);

        srcStorageContext = new StorageContext(srcCxtPvder.getStorageContextInfo());
        destStorageContext = new StorageContext(destCtxPvder.getStorageContextInfo());

        srcStorageContext.setPrefix(srcPrefix);
        destStorageContext.setPrefix(destPrefix);

        srcFileName = srcUploadContext.getFileName();
        destFileName = destUploadContext.getFileName() || srcFileName;

        srcStorageContext.setFileName(srcFileName);
        destStorageContext.setFileName(destFileName);

        fileStore.move(srcStorageContext, destStorageContext, mvCallBack);
    };

    this.copyMessageComponent = function(srcMsgComponent, destMsgComponent, srcCtxProvider, destCtxProvider, cpCallBack) {
        var srcUploadContext, destUploadContext;

        srcUploadContext = new MessageComponentUploadContext(srcMsgComponent);
        destUploadContext = new MessageComponentUploadContext(destMsgComponent);

        this.copy({
                uploadContext: srcUploadContext,
                contextProvider: srcCtxProvider
            }, {
                uploadContext: destUploadContext,
                contextProvider: destCtxProvider
            },
            cpCallBack);
    };

    this.moveMessageComponent = function(srcMsgComponent, destMsgComponent, srcCtxProvider, destCtxProvider, cpCallBack) {
        var srcUploadContext, destUploadContext;

        srcUploadContext = new MessageComponentUploadContext(srcMsgComponent);
        destUploadContext = new MessageComponentUploadContext(destMsgComponent);

        this.move({
                uploadContext: srcUploadContext,
                contextProvider: srcCtxProvider
            }, {
                uploadContext: destUploadContext,
                contextProvider: destCtxProvider
            },
            cpCallBack);
    };

    // PREFIX
    this.getProfilePrefix = function(contextProvider, teamId) {
        var thePrefix, uploadContext;
        uploadContext = new ProfileUploadContext(teamId);

        if (prefixProvider) {
            thePrefix = prefixProvider.getThePrefix(uploadContext, contextProvider, null);
        }
        return thePrefix || emptyPrefix;
    };

    this.getMediaPrefix = function(contextProvider, component) {
        var thePrefix, uploadContext;
        uploadContext = new MessageComponentUploadContext(component);

        if (prefixProvider) {
            thePrefix = prefixProvider.getThePrefix(uploadContext, contextProvider, null);
        }
        return thePrefix || emptyPrefix;
    };

    this.getThumbnailPrefix = function (contextProvider, thumbnailSize) {
        var thePrefix, uploadContext;
        uploadContext = new ThumbnailUploadContext(thumbnailSize);

        if (prefixProvider) {
            thePrefix = prefixProvider.getThePrefix(uploadContext, contextProvider);
        }
        return thePrefix || emptyPrefix;
    };

    this.getBulkImportPrefix = function (contextProvider) {
        var thePrefix, uploadContext;
        uploadContext = new OrganizationUploadContext();

        if (prefixProvider) {
            thePrefix = prefixProvider.getThePrefix(uploadContext, contextProvider);
        }
        return thePrefix || emptyPrefix;
    };
}

module.exports = {

    getInst: function(fileStore, prefixProvider) {
        if (theInstance) {
            return theInstance;
        }

        theInstance = new StorageService(fileStore, prefixProvider);
        return theInstance;
    }

};
