function ModelFactory(modelConfig) {

    var _modelCatalog, _modelFactoryInst, _modelTypes, _modelConfig, _modelIDs;

    _modelCatalog = {};

    _modelIDs = {};

    _modelTypes = {};

    _modelFactoryInst = this;


    function _loadModelConfig(modelConfig) {
        var _modelKeys;

        _modelKeys = Object.keys(modelConfig);

        _modelKeys.forEach(function(modelKey) {
            _modelIDs[modelKey] = modelKey;
            _modelCatalog[modelKey] = modelConfig[modelKey];
        });

    }

    function _loadModelProviderConfig(modelProviderConfig) {
        var __modelTypes;
        __modelTypes = Object.keys(modelProviderConfig);

        __modelTypes.forEach(function(modelType) {
            _modelTypes[modelType] = modelProviderConfig[modelType];
        });


    }

    this.init = function() {
        var _modelFactoryInst;
        _modelConfig = modelConfig || require('./ModelConfig.js');
        _modelFactoryInst = this;
        _loadModelConfig.call(_modelFactoryInst, _modelConfig.modelConfig);
        _loadModelProviderConfig.call(_modelFactoryInst, _modelConfig.modelTypeProviderConfig);
    };

    function _getTheModelTypeAsConfigured(type, contextProvider) {
        var _theModelTypeConstructFn, _theModelTypeInst;

        _theModelTypeConstructFn = _modelTypes[type].getInst;

        if (!_theModelTypeConstructFn) {
            throw new Error('invalid model type configured');
        }

        _theModelTypeInst = _theModelTypeConstructFn(contextProvider);

        return _theModelTypeInst;

    }

    function _getTheModelInstance(getInst, contextProvider, modelProvider) {
        var _theModel;

        _theModel = getInst(contextProvider);

        _theModel.setModelProvider(modelProvider);

        return _theModel;
    }

    this.getModel = function(modelName, contextProvider) {
        var _thisModelConfig, _theModelProvider;
        _thisModelConfig = _modelCatalog[modelName];

        if (!_thisModelConfig) {
            throw new Error('error creating a model - no model exists for name ' + modelName);
        }

        _theModelProvider = _getTheModelTypeAsConfigured(_thisModelConfig.type, contextProvider);

        return _getTheModelInstance(_thisModelConfig.getInst, contextProvider, _theModelProvider);
    };



    //inconvenient methods to fetch model instances

    this.getAuthorizationModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.AUTHORIZATION_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getClientsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.CLIENTS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getUserCredentialsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.USERCRED_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getAccountModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.ACCOUNT_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getUserModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.USER_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getOrganizationModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.ORG_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getConsentPolicyModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.CONSENTPOLICY_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getSystemLicensesModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.SYSTEMLICENSE_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getContactsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.CONTACTS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getUserModelEmmitable = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.USEREMMITABLE_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getMessageTokenModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.MESSAGETOKEN_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getMessageModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.MESSAGE_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getRegistrationModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.REGISTRATION_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getGroupsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.GROUPS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getTheRealGroupsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.THEREALGROUPS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getclientGroupsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.clientGROUPS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getClubsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.CLUBS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getNotificationsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.NOTIFICATIONS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getTokensModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.TOKENS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getDocumentsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.DOCUMENTS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getJobModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.JOB_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getSystemLicensesModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.SYTEM_LICENSES_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getLdapDataImportsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.LDAPDATAIMPORTS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getRolesModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.ROLES_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getPermissionsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;
        _theModelInst = _thisFactory.getModel(_modelIDs.PERMISSIONS_MODEL, contextProvider);
        return _theModelInst;
    };

    this.getRolePermissionsModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.ROLE_PERMISSIONS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getRoleUsersModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.ROLE_USERS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getProductFeaturesModel = function(contextProvider) {
        var _thisFactory, _theModelInst;
        _thisFactory = this;

        _theModelInst = _thisFactory.getModel(_modelIDs.PRODUCT_FEATURES_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getLdapConfigurationsModel = function(contextProvider) {

        var _thisFactory, _theModelInst;
        _thisFactory = this;
        _theModelInst = _thisFactory.getModel(_modelIDs.LDAP_CONFIGURATIONS_MODEL, contextProvider);

        return _theModelInst;
    };

    this.getiDVerTokensModel = function(contextProvider) {
        return this.getModel(_modelIDs.ID_VERIFICATION_MODEL, contextProvider);
    };

    this.getFileTokensModel = function(contextProvider) {
        return this.getModel(_modelIDs.FILE_TOKEN_MODEL, contextProvider);
    };

    this.getFilesModel = function(contextProvider) {
        return this.getModel(_modelIDs.FILE_MODEL, contextProvider);
    };

    this.getThreadViewsModel = function (contextProvider) {
        return this.getModel(_modelIDs.THREAD_VIEWS_MODEL, contextProvider);
    };

    this.getThreadsModel = function (contextProvider) {
        return this.getModel(_modelIDs.THREADS_MODEL, contextProvider);
    };

    this.getPolicyTemplatesModel = function (contextProvider) {
        return this.getModel(_modelIDs.POLICY_TEMPLATE_MODEL, contextProvider);
    };

    this.getGeoLocationModel = function(contextProvider) {
        return this.getModel(_modelIDs.GEO_LOCATION_MODEL, contextProvider);
    };

    this.getSystemTemplatesModel = function(contextProvider) {
        return this.getModel(_modelIDs.SYSTEM_TEMPLATES_MODEL, contextProvider);
    };
    this.getOrgGroupModel = function(contextProvider){
        return this.getModel(_modelIDs.ORG_GROUP_MODEL, contextProvider);
    };

    this.getiDToAccountModel = function(contextProvider) {
        return this.getModel(_modelIDs.ID_ACCOUNT_MODEL, contextProvider);
    };

    this.getTranscodeJobsModel = function (contextProvider) {
        return this.getModel(_modelIDs.TRANSCODE_JOBS_MODEL, contextProvider);
    };

    this.getEntilementModel = function(contextProvider) {
        return this.getModel(_modelIDs.ENTITLEMENT_MODEL, contextProvider);
    };

    this.getLicenseModel = function(contextProvider) {
        return this.getModel(_modelIDs.LICENSE_MODEL, contextProvider);
    };
    this.getAccountToLicenseModel = function(contextProvider) {
        return this.getModel(_modelIDs.ACCOUNT_TO_LICENSES_MODEL, contextProvider);
    };
    this.getAccountModelForLicense = function(contextProvider) {
        return this.getModel(_modelIDs.ACCOUNT_MODEL_FOR_LICENSE, contextProvider);
    };
    this.getSyncReportsModel = function(contextProvider){
        return this.getModel(_modelIDs.SYNC_REPORTS_MODEL, contextProvider);
    };
    this.getSyncReportDetailModel = function(contextProvider){
        return this.getModel(_modelIDs.SYNC_REPORT_DETAIL_MODEL,contextProvider);
    };
    this.getScheduleJobsModel = function(contextProvider){
        return this.getModel(_modelIDs.SCHEDULE_JOBS_MODEL,contextProvider);
    };
    this.getDomainToRetentionModel = function(contextProvider){
        return this.getModel(_modelIDs.DOMAIN_TO_RETENTION_MODEL,contextProvider);
    };
    this.getRetentionModel = function(contextProvider){
        return this.getModel(_modelIDs.RETENTION_MODEL,contextProvider);
    };
    this.getUserProfileModel = function(contextProvider) {
        return this.getModel(_modelIDs.USER_PROFILE_MODEL, contextProvider);
    };
    this.getAlertActionMapModel = function (contextProvider){
        return this.getModel(_modelIDs.ALERT_ACTION_MAP_MODEL,contextProvider);
    };
    this.getSecretKeysModel = function (contextProvider){
        return this.getModel(_modelIDs.SECRET_KEYS_MODEL,contextProvider);
    };
    this.getFilterModel = function (contextProvider){
        return this.getModel(_modelIDs.FILTER_MODEL,contextProvider);
    };
    this.getTeamsModel = function(contextProvider) {
        return this.getModel(_modelIDs.TEAMS_MODEL, contextProvider);
    };
    this.getRetentionsModel = function(contextProvider){
        return this.getModel(_modelIDs.RETENTIONS_MODEL,contextProvider);
    };
    this.getTopicsModel = function(contextProvider){
        return this.getModel(_modelIDs.TOPICS_MODEL,contextProvider);
    };
    this.getPostsModel = function(contextProvider){
        return this.getModel(_modelIDs.POSTS_MODEL,contextProvider);
    };
    this.getUserContextModel = function(contextProvider) {
        return this.getModel(_modelIDs.USER_CONTEXT_MODEL, contextProvider);
    };
    this.getTeamUserCollectionsModel = function(contextProvider){
        return this.getModel(_modelIDs.TEAM_USER_COLLECTION_MODEL,contextProvider);
    };
    //Added team roles model -- @AA@ 27-Sep-2014
    this.getTeamRolesModel = function(contextProvider){
        return this.getModel(_modelIDs.TEAM_ROLES_MODEL,contextProvider);
    };
    this.getTeamTopicsModel = function(contextProvider) {
        return this.getModel(_modelIDs.TEAM_TOPICS_MODEL, contextProvider);
    };
    this.getTopicIntegrationsModel = function() {
        return this.getModel(_modelIDs.TOPIC_INTEGRATIONS_MODEL);
    };
    this.getThreadEmailModel = function () {
        return this.getModel(_modelIDs.THREAD_EMAIL_MODEL);
    };
    this.getAlertActionMessageModel = function (contextProvider){
        return this.getModel(_modelIDs.ALERT_ACTION_MESSAGE_MODEL,contextProvider);
    };
    this.getFlowUserConnectionModel = function (contextProvider){
        return this.getModel(_modelIDs.FLOW_USER_CONNECTION_MODEL,contextProvider);
    };
    this.getActionsModel =  function(contextProvider){
        return this.getModel(_modelIDs.ACTIONS_MODEL,contextProvider);
    };
    this.getAlertsModel =  function(contextProvider){
        return this.getModel(_modelIDs.ALERTS_MODEL,contextProvider);
    };
    this.getAlertPostMapsModel = function() {
        return this.getModel(_modelIDs.ALERT_POST_MAPS_MODEL);
    };
    this.getMessageRuleModel = function(contextProvider){
        return this.getModel(_modelIDs.MESSAGE_RULE_MODEL,contextProvider);
    };
    this.getMRuleMappingsModel = function(contextProvider){
        return this.getModel(_modelIDs.RULE_MAPPINGS_MODEL,contextProvider);
    };
    this.getAlertActionsModel = function(contextProvider){
        return this.getModel(_modelIDs.ALERT_ACTIONS_MODEL,contextProvider);
    };
    // Market Place
    this.getMPStreamModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_STREAMS_MODEL,contextProvider);
    };
    this.getMPAlertModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_ALERTS_MODEL,contextProvider);
    };
    this.getMPActionModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_ACTIONS_MODEL,contextProvider);
    };
    this.getMPWorkFlowModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_WORKFLOWS_MODEL,contextProvider);
    };
    this.getMPUserBasketModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_USERBASKET_MODEL,contextProvider);
    };
    this.getMPUserOrderModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_USERORDER_MODEL,contextProvider);
    };
    this.getMPReviewModel = function(contextProvider){
        return this.getModel(_modelIDs.MARKETPLACE_REVIEWS_MODEL,contextProvider);
    };
    // Developer tool for alertaction(integrations)
    this.getBTStreamModel = function(contextProvider){
        return this.getModel(_modelIDs.BUILDERTOOL_STREAM_MODEL,contextProvider);
    };
    this.getBTAlertModel = function(contextProvider){
        return this.getModel(_modelIDs.BUILDERTOOL_ALERT_MODEL,contextProvider);
    };
    this.getBTFilterModel = function(contextProvider){
        return this.getModel(_modelIDs.BUILDERTOOL_FILTER_MODEL,contextProvider);
    };
    this.getBTActionModel = function(contextProvider){
        return this.getModel(_modelIDs.BUILDERTOOL_ACTION_MODEL,contextProvider);
    };
    this.getBTMapModel =  function(contextProvider){
        return this.getModel(_modelIDs.BUILDERTOOL_MAP_MODEL,contextProvider);
    };
    this.getBTclientMapModel =  function(contextProvider){
        return this.getModel(_modelIDs.BUILDERTOOL_clientMAP_MODEL,contextProvider);
    };
    this.getAlertJobModel = function(contextProvider){
        return this.getModel(_modelIDs.AJOBS_MODEL,contextProvider);
    };
}

module.exports = {
    getInst: function(modelConfig) {
        return new ModelFactory(modelConfig);
    }
};
