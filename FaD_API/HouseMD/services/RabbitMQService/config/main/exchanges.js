/**
 * Object containing info regarding all the exchanges. The object template is below.
 *
 * {
 *  {EXCHANGE_NAME} : {
 *      "publishOpts" : {
 *          "deliveryMode": 2 // 1 - non-persistant, 2 - persistant
 *      },
 *      "options": {
 *          "type" : {EXCHANGE_TYPE},
 *          //rabbitmq gives an ack when persisted to disk - https://www.rabbitmq.com/confirms.html
 *          "confirm" : true
 *      }
 *  }
 * }
 *
 * if no options are mentioned then the default are taken.
 * "type" key in "options" is compulsary
 */

module.exports = {
    //all queues will be bound to the default exchange (not the same as the rabbitmq default exchange).
    //the routing key will be the queue name.
    "default" : {
        "options" : {
            "type" : "direct"
        }
    },

    "dead_letter" : {
        "options" : {
            "type" : "direct"
        }
    },

    "transcode" : {
        "options" : {
            "type" : "direct"
        }
    },

    "send_message" : {
        "options" : {
            "type" : "topic"
        }
    },

    "publish_timeline":{
        "options" : {
            "type" : "topic"
        }
    },

    "publish_message" : {
        "options" : {
            "type" : "direct"
        }
    },

    "recall_message" : {
        "options" : {
            "type" : "topic"
        }
    },

    "read_receipts" : {
        "options" : {
            "type" : "direct"
        }
    },

    "notifications" : {
        "options" : {
            "type" : "direct"
        }
    },

    "thumbnails" : {
        "options" : {
            "type" : "direct"
        }
    },
    
    "pwdPolicy_notification" : {
        "options" : {
            "type" : "direct"
        }
    },

    "account_migration" : {
        "options":{
            "type":"direct"
        }
    },

    "account_cancellation":{
        "options":{
            "type":"direct"
        }
    },

    "account_reactivation":{
        "options":{
            "type":"direct"
        }
    },

    "userContext":{
        "options":{
            "type":"direct"
        }
    },

    "teams": {
        "options": {
            "type": "topic"
        }
    },

    "threads" : {
        "options" : {
            "type" : "topic"
        }
    },

    "assign_license":{
        "options":{
            "type":"topic"
        }
    },

    "users": {
        "options": {
            "type": "topic"
        }
    },

    "msg_rule_notification" : {
        "options" : {
            "type" : "direct"
        }
    }
};
