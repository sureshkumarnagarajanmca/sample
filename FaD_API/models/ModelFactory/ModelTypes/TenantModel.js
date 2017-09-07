function TenantModel(tenanatDSInfo) {

    this.getModel = function(modelName) {
        var dbMgr = require('../../../db/DBManager').getInst();
        return dbMgr.getTenantModel(modelName, tenanatDSInfo);
    };
}

module.exports = function(contextProvider) {
    //console.log('tenant');
    //console.log(contextProvider);
    if (!contextProvider || !contextProvider.getDatasource) {
        throw new Error('error creating tenant model -  no context provider');
    }
    return new TenantModel(contextProvider.getDatasource());
};
