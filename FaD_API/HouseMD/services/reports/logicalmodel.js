var logicalModel = {
    dimensions: {
        organization: {
            name: "organization",
            group: "User",
            datasource: "es",
            datatype: "string",
            field: "orgId",
            dstype: "terms"
        },
        account: {
            name: "account",
            group: "User",
            datasource: "es",
            datatype: "string",
            field: "accountId",
            dstype: "terms"
        },
        user: {
            name: "user",
            group: "User",
            datasource: "es",
            datatype: "string",
            field: "userId",
            dstype: "terms"
        },
        date: {
            name: "date",
            group: "Time",
            datasource: "es",
            datatype: "date",
            field: "@timestamp",
            dstype: "date_histogram",
            format: "yyyy-MM-dd",
            interval: '1d'
        },
        userAgent: {
            name: "userAgent",
            group: "User",
            datasource: "es",
            datatype: "string",
            field: "userAgent",
            dstype: "terms"
        },
        messageType: {
            name: "messageType",
            group: "Message",
            datasource: "es",
            datatype: "string",
            field: "event_type",
              event_filters: {
                "event_type": ["single", "multi", "audio", "text", "video", "image"],
            },
            dstype: "terms"
        },
        msgType: {
            name: "msgType",
            group: "Message",
            datasource: "es",
            datatype: "string",
            field: "messageType",
              event_filters: {
                "messageType": ["message", "memo", "private", "email"],
            },
            dstype: "terms"
        },
        policy: {
            name: "policy",
            group: "Message",
            datasource: "es",
            datatype: "string",
            field: "policy",
              event_filters: {
                "policy": [true, false],
            },
            dstype: "terms"
        },
        year: {
            name: "year",
            group: "Time",
            datasource: "es",
            datatype: "date",
            field: "@timestamp",
            dstype: "date_histogram",
            format: "yyyy",
            interval: 'year'
        },
        month: {
            name: "month",
            group: "Time",
            datasource: "es",
            datatype: "date",
            field: "@timestamp",
            dstype: "date_histogram",
            format: "MM",
            interval: 'month'
        },
        week: {
            name: "week",
            group: "Time",
            datasource: "es",
            datatype: "date",
            field: "@timestamp",
            dstype: "date_histogram",
            format: "w",
            interval: 'week'
        },
        team: {
            name: "team",
            group: "User",
            datasource: "es",
            datatype: "String",
            field: "teamId",
            dstype: "terms"
        },
        topic: {
            name: "topic",
            group: "User",
            datasource: "es",
            datatype: "String",
            field: "topicId",
            dstype: "terms"
        },
        postSource: {
            name: "postSource",
            group: "teams",
            datasource: "es",
            datatype: "String",
            field: "postType",
            dstype: "terms"
        },
        componentType: {
            name: "componentType",
            group: "teams",
            datasource: "es",
            datatype: "String",
            field: "event_type",
            dstype: "terms"
        }
    },
    metrics: {
        userCount: {
            name: "userCount",
            group: "User",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                resource: "user",
                action: "activate",
            },
            type: "value_count"
        },
        newUserCount: {
            name: "newUserCount",
            group: "User",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                resource: "user",
                action: "activate",
            },
            type: "value_count"
        },
        sessionCount: {
            name: "sessionCount",
            group: "Session",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "user",
                "action": "login",
            },
            type: "value_count"
        },
        avgSessionDuration: {
            name: "avgSessionDuration",
            group: "Session",
            datasource: "es",
            datatype: "integer",
            field: "sessionTime",
            event_filters: {
                resource: "user",
                action: "logout",
            },
            type: "avg"
        },
        messageCount: {
            name: "messageCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            type: "value_count"
        },
        singleComponentCount: {
            name: "singleComponentCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            field: "event_type",
            event_filters: {
                "resource": "message",
                "action": "create",
                "event_type": "single",
                "nameSpace" : "messages"
            },
            type: "value_count"
        },
        multiComponentCount: {
            name: "multiComponentCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            field: "event_type",
            event_filters: {
                "resource": "message",
                "action": "create",
                "event_type": "multi",
                "nameSpace" : "messages"
            },
            type: "value_count"
        },
        textCount: {
            name: "textCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "textCount",
            type: "sum"
        },
        audioCount: {
            name: "audioCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "audioCount",
            type: "sum"
        },
        videoCount: {
            name: "videoCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "videoCount",
            type: "sum"
        },
        imageCount: {
            name: "imageCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "imageCount",
            type: "sum"
        },
        attachmentCount: {
            name: "attachmentCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "attachmentCount",
            type: "sum"
        },
        filelinkCount: {
            name: "filelinkCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "filelinkCount",
            type: "sum"
        },
        contactCount: {
            name: "contactCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create"
            },
            field: "contactCount",
            type: "sum"
        },
        locationCount: {
            name: "locationCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "locationCount",
            type: "sum"
        },
        componentCount: {
            name: "componentCount",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "message",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "totalCount",
            type: "sum"
        },
        storageConsumed: {
            name: "storageConsumed",
            group: "Message",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "filecomponents",
                "action": "create",
                "nameSpace" : "messages"
            },
            field: "fileSize",
            type: "sum"
        },
        postCount: {
            name: "postCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "post",
                "action": "create"
            },
            type: "value_count"
        },
        topicCount: {
            name: "topicCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "topic",
                "action": "create"
            },
            type: "value_count"
        },
        chatMessageCount: {
            name: "chatMessageCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "chat",
                "action": "create",
                "nameSpace": "teams"
            },
            type: "value_count"
        },
        alertCount: {
            name: "alertCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "post",
                "action": "create",
                "nameSpace": "teams",
                "postType" : "alert"
            },
            type: "value_count"
        },
        teamTextCount: {
            name: "teamTextCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "textCount",
            type: "sum"
        },
        teamAudioCount: {
            name: "teamAudioCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "audioCount",
            type: "sum"
        },
        teamVideoCount: {
            name: "teamVideoCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "videoCount",
            type: "sum"
        },
        teamImageCount: {
            name: "teamImageCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "imageCount",
            type: "sum"
        },
        teamAttachmentCount: {
            name: "teamAttachmentCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "attachmentCount",
            type: "sum"
        },
        teamFilelinkCount: {
            name: "teamFilelinkCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "chat",
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "filelinkCount",
            type: "sum"
        },
        teamContactCount: {
            name: "teamContactCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "contactCount",
            type: "sum"
        },
        teamLocationCount: {
            name: "teamLocationCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "locationCount",
            type: "sum"
        },
        teamComponentCount: {
            name: "teamComponentCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat','post'],
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "totalCount",
            type: "sum"
        },
        teamStorageConsumed: {
            name: "teamStorageConsumed",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": "filecomponents",
                "action": "create",
                "nameSpace" : "teams"
            },
            field: "fileSize",
            type: "sum"
        },
        teamPostStorageConsumed: {
            name: "teamPostStorageConsumed",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['post', 'comment'],
                "action": "fileupload",
                "nameSpace" : "teams"
            },
            field: "fileSize",
            type: "sum"
        },
        teamMessageStorageConsumed: {
            name: "teamMessageStorageConsumed",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            event_filters: {
                "resource": ['chat'],
                "action": "fileupload",
                "nameSpace" : "teams"
            },
            field: "fileSize",
            type: "sum"
        },
        teamMemberCount: {
            name: "teamMemberCount",
            group: "Teams",
            datasource: "es",
            datatype: "integer",
            field: "action",
            event_filters: {
                "resource": "teammember",
                "action": "activate"
            },
            type: "value_count"
        }
    }
};

module.exports = logicalModel;