function IntMasterModel() {

    this.getModel = function(modelName) {
        var dbMgr;
//        console.log('defaultModel getModel - ' + modelName);
        dbMgr = require('../../../db/DBManager').getInst();
        return dbMgr.getModel(modelName);
    };
}

module.exports = function() {
    return new IntMasterModel();
};
