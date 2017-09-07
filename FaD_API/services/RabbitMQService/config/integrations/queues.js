/**
 * Object containing info regarding all the queues. The object template is below.
 *
 * {
 *  {QUEUE_NAME} : {
 *      "exchanges": {
 *          {EXCHANGE_NAME} : {ROUTING_KEYS}
 *      },
 *      "createOpts": {RABBITMQ_QUEUE_CREATE_OPTIONS}
 *      "subscribeOpts": {RABBITMQ_QUEUE_SUBSCRIBE_OPTIONS}
 *  }
 * }
 *
 * if no options are mentioned then the default are taken.
 * "exchanges" key is compulsary
 */

module.exports = {
    "alert" : {
    },

    "filter" : {
    },

    "resolver" : {
    },

    "action" : {
    },

    "messages" : {
    },

    "emailalert" : {
    },

    "emailvalidate" : {

    },

    "actionack" : {

    },

    "agendajobs" : {

    },

    "nextruntime" : {

    },

    "webservicedata" : {

    }
};
