/**
 * boots the application by initiating setting and routes.
 */

var passport = require('passport');
var serviceHandler = require('../../api/serviceHandler');
var errorHandler = serviceHandler.errorHandler;
var errors = serviceHandler.errors;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var batch = require('../../services/Batch');
var routeHeader = require('../../api/middleware/RouteHeader');
var config      = require('../../config');
var elasticsearch = require('elasticsearch');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
    
 
var client = elasticsearch.Client({
    host: '10.0.90.14:9200'
});
// config.db.database = "fadupload";
// db configuration


var db = require('../../db/connections/db.js');
// var store = new MongoDBStore({ 
//     uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
//     collection: 'mySessions'
// });
//enable cors
config.app.cors = '*';

var multipart = require('connect-multiparty');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');

// confiure access logger and add global error logger middleware
function configureLogger(app) {
    var audit = require(config.app.root + '/api/services/AuditLogService').middleware;
    app.use(audit);
}

/**
 * This function initiates the server with configuration to match deployment model
 * @param app
 */
 function configuringConfid(){
    // console.log(config);
    console.log(config.app.environment);
    if(config.app.environment === 'production'){
        config.db = config.dbprod;
        config.notifier = config.notifierprod;
        config.elasticsearch = config.elasticsearchProd;
    }else if(config.app.environment === 'test'){
        config.db = config.dbQA;
        config.notifier = config.notifierQA;
        config.elasticsearch = config.elasticsearchQa;
    }else if(config.app.environment === 'amazon'){
        config.db = config.dbamazon;
        config.elasticsearch = config.elasticsearchamazon;
    }

    
    db.init();    
 }

function _bootApplication(app) {
    
    // cinfigurting config
    configuringConfid();

    // for image upload 
    
    var multipartMiddleware = multipart();

    
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    var service = config.app.service;
    app.use(function(req, res, next) {
        res.header('Server', service);
        next();
    });
    app.use(routeHeader);

    // if (config.app.environment === 'development') {
        //CORS middleware
        if (config.app.cors) {
            app.use(function(req, res, next) {
                res.header('Access-Control-Allow-Origin', config.app.cors);
                res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
                res.header('Access-Control-Allow-Headers',
                    'Authorization,Content-Type,X-Requested-With,X-HTTP-Method-Override,accessToken');
                res.header('Access-Control-Allow-Credentials', true);
                // res.set('Access-Control-Allow-Max-Age', 3600);
                if ('OPTIONS' === req.method) {
                    return res.status(200).end();
                }
                next();
            });
        }
    // }

    app.use(bodyParser({
        limit: '2mb',
       // uploadDir: config.uploads.uploadDir,
        keepExtensions: true
    }));
    app.use(cookieParser());
    /*app.use(require('express-session')({
        secret : 'ASDFGHJKL',
        resave : false,
        saveUninitialized : false
    }));*/
// 
    // app.use(busboy());

    configureLogger(app); //For audit logs

  
    app.use(methodOverride());
    require('../AuthServer/auth.js');
    var auth  = require('../AuthServer/helper/authorization');


    // express-session
    var sessionOptions ={ 
        secret: 'keyboard cat'
        // ,
        // store: new MongoStore({ mongooseConnection: conn })
        // cookie: { maxAge: 000 }
        // resave: false,
        // saveUninitialized: false,
        // genid: function(req) {
        //     return genuuid() // use UUIDs for session IDs 
        // }
    }
    // app.use(session(sessionOptions));
    app.use(passport.initialize());
    // app.use(passport.session());


    //passport config

   /* var UserLogin = require('../../db/dbModels/Logininfo');
    app.post('/login', [AuthCtrl.login]);
    app.post('/register', [AuthCtrl.register]);
    app.get('/authorized',AuthCtrl.authorized);

    app.post('/logout', [AuthCtrl.logout]);
*/
 
    var isAuthenticated = function (req, res, next) {
        // if user is authenticated in the session, call the next() to call the next request handler
        // Passport adds this method to request object. A middleware is allowed to add properties to
        // request and response objects
        if (req.isAuthenticated())
            return next();
        // if the user is not authenticated then redirect him to the login page
        res.send({});
    }

    app.post('/api/fileUpload', multipartMiddleware, function(req, resp) {
      fs.readFile(req.files.file.path, function (err, data) {
        var imageName = req.files.file.originalFilename
        // If there's an error
        if(!imageName){
          console.log("There was an error")
          resp.redirect("/");
          resp.end();
        } else {
          var newPath = __dirname + "/../../uploads/" + imageName;
          // write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {

             init(app,imageName,newPath,resp);
          });
        }
      });
    });

    function init(app,filename,path,resp) {  
        // streaming to gridfs
        //filename to store in mongodb
        var writestream = gfs.createWriteStream({
            filename: filename
        });
        fs.createReadStream(path).pipe(writestream);
     
        writestream.on('close', function (file) {
             fs.unlinkSync(path);
            resp.send({imageId : file._id});
        });
    };

    app.get('/api/getFile',function(req,res){
        var imageId = req.query.imageId;
           gfs.files.find({"_id": mongoose.Types.ObjectId(imageId)}).toArray(function (err, files) {
            if (err) {
                res.json(err);
            }
            if (files.length > 0) {
                var mime = 'image/jpeg';
                res.set('Content-Type', mime);
                var read_stream = gfs.createReadStream({"_id": imageId});
                read_stream.pipe(res);
            } else {
                res.json('File Not Found');
            }
        });
     });



    app.use('/api/users/batch', batch.route());

    //Load all route mappings
    require('../../api').load(app);

    /**
     * error middleware
     * dispatch all errors (most likely synchronous)
     * log exceptions as needed
     *
     * THIS IS THE FINAL MIDDLEWARE
     */
    app.use(function(err, req, res, next) {
        /*if (err instanceof SyntaxError)
            return errorHandler(new errors.BadRequest('Malformed JSON'), req, res);
        if(err instanceof PepError){
            return errorHandler(new errors.Forbidden(err.msg), req, res);
        }*/

        if (err instanceof Error) {
            //catching errors from body-parser
            if ((err.message === 'invalid json, empty body') ||
                (err.message === 'invalid json')) {

                return errorHandler(new errors.BadRequest('Malformed JSON', req, res));
            }
        }

        errors.loge(err);

        //if no handlers for error, then send back Internal Server Error
        errorHandler(new errors.Internal(), req, res);

        next();
    });
}

/*function parsemem(mu) {
    return {
        rss: parseFloat(mu.rss / 1048576).toFixed(2) + ' mb',
        heapTotal: parseFloat(mu.heapTotal / 1048576).toFixed(2) + ' mb',
        heapUsed: parseFloat(mu.heapUsed / 1048576).toFixed(2) + ' mb'
    };
}*/

module.exports = function(app) {

    _bootApplication(app);

   /* if (config.app.seedData) {
        console.log('\n\n\n======================\nCreate Seed Data\n====================\n');
        require('./createMasterData.js').init();
    }

    if (config.app.memoryusage) {
        config.app.memoryusage = (config.app.memoryusage < 1000) ? 1000 : config.app.memoryusage;
        setInterval(function() {
            console.log(parsemem(process.memoryUsage()));
        }, config.app.memoryusage);
    }

    if (config.app.processJobs)
        require('../../JobServer.js');*/
};
