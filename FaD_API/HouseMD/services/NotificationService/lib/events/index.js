module.exports = {
    Message: require('./MessageStrategy.js'),
    Email: require('./EmailStrategy.js'),
    Sms: require('./SmsStrategy.js'),
    DataSync: require('./DataSyncStrategy.js'),
    Recall: require('./RecallStrategy.js'),
    Push: require('./PushStrategy.js'),
    Teams: require('./TeamsStrategy.js'),
    Enterprise: require('./EnterpriseStrategy.js'),
    Post:require('./PostsStrategy.js'),
    Topic:require('./TopicsStrategy.js')
};