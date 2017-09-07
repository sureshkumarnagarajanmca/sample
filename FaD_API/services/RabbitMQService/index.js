var amqp = require('amqp');
var amqpConn;
var jobConfig = require('./config');
var amqpQueues = jobConfig.queues;
var amqpExchanges = jobConfig.exchanges;
var env = global.environment;
if (typeof(env) === 'undefined'){
    env = "main";
}

var connectionOpts = {
	host: config.rabbitmq[env].host,
	port: config.rabbitmq[env].port,
    login: config.rabbitmq[env].user,
    password: config.rabbitmq[env].pass
};

console.log(JSON.stringify(connectionOpts));
var events = require('events');
var amqpService = new events.EventEmitter();

function checkIfServiceIsReady() {
    var _ready = true, qs, exs;

    qs = Object.keys(amqpQueues);
    exs = Object.keys(amqpExchanges);

    qs.forEach(function(q) {
        if (!amqpQueues[q].queue) {
            _ready = false;
        }
    });

    exs.forEach(function (ex) {
        if (!amqpExchanges[ex].exchange) {
            _ready = false;
        }
    });

    if (_ready) {
        amqpService.emit('ready');
    }
}

function openQueue(queueName, cb) {
    var queueObj = amqpQueues[queueName];

    if (queueObj.queue) {
        cb(new Error('Invalid Queue'));
    }

    amqpConn.queue(queueName, queueObj.createOpts, function (queue) {
        amqpQueues[queue.name].queue = queue;
        cb();
    });
}

function openExchange(exchangeName, cb) {
    var exchangeObj = amqpExchanges[exchangeName];

    if (exchangeObj.exchange) {
        cb(new Error('Invalid Exchange'));
    }

    amqpConn.exchange(exchangeName, exchangeObj.options, function (exchange) {
        amqpExchanges[exchange.name].exchange = exchange;
        cb();
    });
}

if (config.rabbitmq[env].enabled) {
    amqpConn = amqp.createConnection(connectionOpts, {reconnect:true});

    amqpConn.on('error', function(err) {
        exports.connectionState = false;
        amqpQueues = jobConfig.queues;
        amqpExchanges = jobConfig.exchanges;
        config.errors.loge(err);
        amqpService.emit('notready');
        //throw new Error ('Rabbitmq Disconnected');
    });

    amqpConn.on('close', function () {
        exports.connectionState = false;
        amqpQueues = jobConfig.queues;
        amqpExchanges = jobConfig.exchanges;
        console.warn('Rabbitmq disconnected');
        amqpService.emit('notready');
        //throw new Error ('Rabbitmq Disconnected');
    });

    amqpConn.on('ready', function () {
        exports.connectionState = true;

        console.log('RabbitMQ Connected on host: %s, port: %s', connectionOpts.host, connectionOpts.port);

        var exchanges, queues;

        exchanges = Object.keys(jobConfig.exchanges);
        queues = Object.keys(jobConfig.queues);

        //adding default exchange
        exchanges.forEach(function(exchange) {
            openExchange(exchange, checkIfServiceIsReady);
        });

        queues.forEach(function(queue) {
            openQueue(queue, checkIfServiceIsReady);
        });
    });
}

exports.queues = amqpQueues;
exports.exchanges = amqpExchanges;
exports.service = amqpService;
