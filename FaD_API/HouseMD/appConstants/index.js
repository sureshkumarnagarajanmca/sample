var path = require('path'),
    HOST_NAME = process.env.HOSTNAME, //'localhost',
    HOST_SERVER_PORT = 80,
    HOST_SERVER_SECURE_PORT = 443,
    SSL_FILE_NAME,
    SERVER_DIR = path.dirname(process.mainModule.filename),
    PROJ_DIR = path.normalize(SERVER_DIR),
    DEBUG = false,


    LOGGER_COMPONENT;

// Server Specific configuration
if (HOST_NAME === 'qa.fad.com') {
    SSL_FILE_NAME = "fad";
} else if (HOST_NAME === 'www.fad.com') {
    SSL_FILE_NAME = "fad";
    HOST_SERVER_PORT = 80;
    HOST_SERVER_SECURE_PORT = 8443;
    DEBUG = true;
} else {
    SSL_FILE_NAME = "local";
    DEBUG = true;
}

LOGGER_COMPONENT = [{
    name: 'userMngmnt',
    serviceName: 'FadUserLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'message',
    serviceName: 'MessageLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'transcode',
    serviceName: 'TranscodeLogger',
    level: 'info'
    //logToConsole:DEBUG
}, {
    name: 'mongoDB',
    serviceName: 'DBLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'scheduling',
    serviceName: 'ScheduleLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'default',
    serviceName: 'DefaultLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'transcodeErrors',
    serviceName: 'TranscodeErrLogger',
    level: 'info'
    //logToConsole:DEBUG
}, {
    name: 'mq',
    serviceName: 'MQLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'ldap',
    serviceName: 'LdapLogger',
    level: 'info',
    logToConsole: DEBUG
}, {
    name: 'authentication',
    serviceName: 'AuthenticationLog',
    level: 'info'
    //logToConsole:DEBUG
}];

module.exports = {
    VERSION: '0.0.1',
    html5mode: true,

    SERVER_DIR: SERVER_DIR,
    serverdir: SERVER_DIR,

    appConf: {
        port: HOST_SERVER_PORT,
        secure_port: HOST_SERVER_SECURE_PORT,
        host: HOST_NAME,
        sessionsecret: 'ASDFGHJKL'
    },

    FAD_FS_MOUNT: path.normalize(PROJ_DIR + '/FadFileSystem'),

    webdir: {
        views: path.normalize(PROJ_DIR + '/Client/views'),
        layouts: path.normalize(PROJ_DIR + '/Client/layouts'),
        publicdir: path.normalize(PROJ_DIR + '/Client/public'),
        logsdir: path.normalize(PROJ_DIR + '/logs/'),
        uploadsdir: path.normalize(PROJ_DIR + '/Client/public/uploads'),
        thumbnailsdir: path.normalize(PROJ_DIR + '/Client/public/thumbnails'),
        serverdir: path.normalize(PROJ_DIR),
        dbdir: path.normalize(PROJ_DIR + '/db'),
        resourcesdir_group: path.normalize(PROJ_DIR + '/Client/public/resources/group'),
        resourcesdir_profile: path.normalize(PROJ_DIR + '/Client/public/resources'),
        resourcesdir_club: path.normalize(PROJ_DIR + '/Client/public/resources/club'),
        resourcesdir: path.normalize(PROJ_DIR + '/Client/public/resources')
    },

    dbConf: {
        host: 'localhost',
        port: '27017',
        database: 'fadauth',
        sessionStore: 'sessions',
        // hosts: ['localhost', 'localhost', 'localhost'],
        // ports: [27017, 27001, 27002],
        hosts: ['localhost'],
        ports: [27017],
        replEnabled: 'false',
        replName: 'myset'
    },

  /*  shareddbConf: {
        host: 'localhost',
        port: '27017',
        database: 'fadauth',
        sessionStore: 'sessions',
        hosts: ['localhost', 'localhost', 'localhost'],
        ports: [27017, 27001, 27002],
        replEnabled: 'false',
        replName: 'mysharedset'
    },*/

   /* isolateddbConf: {
        host: 'localhost',
        port: '27017',
        hosts: ['localhost', 'localhost', 'localhost'],
        ports: [27017, 27001, 27002],
        replEnabled: 'false',
        replName: 'myIsolatedset'
    },*/

    // emailConfig: EMAIL_CONFG,

    notifyServiceConfig: {
        host: 'localhost',
        port: 6379,
        pollInterval: 2000,
        maxSize: 1048576
    },

    securityVerfierEndpoint: {
        host: 'localhost',
        port: HOST_SERVER_PORT,
        isSecure: false
    },



    security: {
        contentencdecalgo: 'aes192',
        contentencryption: true // enable/ disable encryption decryption service
    },

    schedulerQ: 'schedulerchannel',

    channel: {
        segregation: true, // enable(true), disable(false) segregation
        extnToChannels: {
            'mp4': ['desktopweb', 'iphone', 'windows-native'],
            '3gp': ['android'],
            'amr': ['android'],
            'mp3': ['desktopweb', 'iphone']
        },
        allChannels: ['desktopweb', 'iphone', 'android', 'windows-native']
    },

   /* SSL: {
        key: path.normalize(SERVER_DIR + '/certs/' + SSL_FILE_NAME + '.key'),
        crt: path.normalize(SERVER_DIR + '/certs/' + SSL_FILE_NAME + '.crt')
    },*/

    getURLoffload: {
        modulePath: path.normalize(SERVER_DIR + '/getURLChildProcess.js'),
        offload: false, //// enable(true), disable(false)
        parentRoot: path.normalize(SERVER_DIR)
    },

    LoggerComponent: LOGGER_COMPONENT,

    loggerConfig: {
        host: 'localhost',
        port: 50000,
        redis: {
            channel: 'winston'
        }
    },

    webNotificationsServer: 'redis', //supported servers kafka,redis

    channelNotificationsServer: 'rabbitmq', //supported servers kafka,redis,rabbitmq

    segregateTranscoder: false,
};
