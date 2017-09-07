module.exports = {
    "queue" : {
        "createOpts" : {
            "autoDelete" : false,
            "durable" : true,
            "arguments" : {
                "x-dead-letter-exchange" : "dead_letter",
                "x-dead-letter-routing-key" : "retry"
            }
        },
        "subscribeOpts" : {
        // "ack": true makes it the worker queue model
            "ack" : true
        }
    },
    "exchange" : {
        "publishOpts": {
            "deliveryMode": 2 // 1 - non-persistant, 2 - persistant
        },
        "options" : {
            //rabbitmq gives an ack when persisted to disk - https://www.rabbitmq.com/confirms.html
            "confirm" : true
        }
    }
};
