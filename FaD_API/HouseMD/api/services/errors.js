//Added file for specifying sso related errors -- @AA@ 16-Sep-2014
module.exports = {
    'UserProfileNotFound': {
        'message': 'UserProfileNotFound',
        'customCode': "UserProfileNotFound",
        'statusCode': 404
    },
    'SSONotEnabled': {
        'message': 'SSO Not Enabled',
        'customCode': 400,
        'statusCode': 400
    },
    'LdapConfigurationsUpdateError': {
        'message': 'Error while updating directory settings',
        'customCode': "LdapConfigurationsUpdateError",
        'statusCode': 400
    },
    'LdapConfigurationsError': {
        'message': 'Error while saving directory settings',
        'customCode': "LdapConfigurationsError",
        'statusCode': 400
    },
    'LdapConfigurationsNotFound': {
        'message': 'No directory settings found',
        'customCode': "LdapConfigurationsNotFound",
        'statusCode': 400
    },
    'LdapConnectionError': {
        'message': 'Server not able to connect with Active directory server',
        'customCode': "LdapConnectionError",
        'statusCode': 500
    },
};