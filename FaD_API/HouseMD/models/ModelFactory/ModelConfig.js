module.exports.modelConfig = {
    AUTHORIZATION_MODEL: {
        getInst: require('../AuthorizationModel.js').getInst,
        type: 'DEFAULT'
    },

    USER_MODEL: {
        getInst: require('../UserModel.js').getInst,
        type: 'TENANT'
    },

    USEREMMITABLE_MODEL: {
        getInst: require('../UserModel.Emmitable.js').getInst,
        type: 'TENANT'
    },

    USER_PROFILE_MODEL: {
        getInst: require('../UserProfileModel.js').getInst,
        type: 'TENANT'
    }

};

module.exports.modelTypeProviderConfig = {
    DEFAULT: {
        getInst: require('./ModelTypes/DefaultModel.js')
    },
    TENANT: {
        getInst: require('./ModelTypes/TenantModel.js')
    },
    INTEGRATION: {
        getInst: require('./ModelTypes/IntMasterModel.js')
    }


};
