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
    }
};
