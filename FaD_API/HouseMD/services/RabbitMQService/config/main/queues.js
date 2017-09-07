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
    "failed_jobs": {
        "exchanges": {
            "dead_letter": "failed"
        }
    },

    "retry_jobs": {
        "exchanges": {
            "dead_letter": "retry"
        }
    },

    "comp_copy": {},

    "transcode": {
        "exchanges": {
            "transcode": "transcode"
        }
    },

    "transcode_status": {
        "exchanges": {
            "transcode": "transcode_status"
        }
    },

    "msg_thread": {
        "exchanges": {
            "send_message": "message.#.thread.#"
        }
    },

    "msg_threadview": {
        "exchanges": {
            "send_message": "message.#.threadview.#"
        }
    },

    "msg_contacts": {
        "exchanges": {
            "send_message": "message.#.contacts.#"
        }
    },

    "msg_copies": {
        "exchanges": {
            "send_message": "message.#.copies.#"
        }
    },

    "comp_thumbnails": {
        "exchanges": {
            "send_message": "message.#.thumbnails.#",
            "thumbnails": "message"
        }
    },

    "msg_refresh_stats" : {
        "exchanges" : {
            "recall_message": "recall.#.stats_update.#"
        }
    },

    "msg_stats": {
        "exchanges" : {
            "send_message" : "message.#.stats.#"
        }
    },

    "msg_notification": {
        "exchanges": {
            "send_message": "message.#.notification.#"
        }
    },

    "msg_index": {
        "exchanges": {
            "send_message": "message.#.index.#"
        }
    },

    "file_copies": {
        "exchanges": {
            "publish_message": "files"
        }
    },

    "msg_publish": {
        "exchanges": {
            "publish_message": "message"
        }
    },

    "msg_expiry": {
        "exchanges": {
            "send_message": "message.#.expiry.#"
        }
    },

    "msg_forward": {
        "exchanges": {
            "send_message": "message.#.forward.#"
        }
    },

    "file_link": {
        "exchanges": {
            "send_message": "message.#.fileLink.#"
        }
    },

    "file_unlink": {
        "exchanges": {
            "recall_message": "recall.#.files.#"
        }
    },

    "rr_delivered": {
        "exchanges": {
            "send_message": "message.#.deliveryRR.#",
            "read_receipts": "delivered"
        }
    },

    "rr_readAt": {
        "exchanges": {
            "read_receipts": "readAt"
        }
    },

    "rr_expired": {
        "exchanges": {
            "read_receipts": "expired"
        }
    },

    "rr_notification": {
        "exchanges": {
            "notifications": "readreceipt"
        }
    },

    "ss_notification": {
        "exchanges": {
            "notifications": "screenshot"
        }
    },

    "thread_notification": {
        "exchanges": {
            "notifications": "thread"
        }
    },

    "recall_notification": {
        "exchanges": {
            "notifications": "recall"
        }
    },

    "delete_message": {
        "exchanges": {
            "recall_message": "recall.#.message.#"
        }
    },

    "threadview_lastmessage": {
        "exchanges": {
            "recall_message": "recall.#.threadview.#"
        }
    },

    "thread_remove_message": {
        "exchanges": {
            "recall_message": "recall.#.thread.#"
        }
    },

    "expire_message": {},

    "delete_on_expiry" : {},

    "pwd_expiry_notification": {
        "exchanges": {
            "pwdPolicy_notification": "password_expiry"
        }
    },

    "pwd_Policy_notification": {
        "exchanges": {
            "pwdPolicy_notification": "password_policy"
        }
    },

    "teams_postcreate": {
        "exchanges": {
            "teams": "postcreateteam"
        }
    },

    "teams_sfdc": {
        "exchanges": {
            "teams": "sfdc"
        }
    },

    "default_topics": {
        "exchanges": {
            "teams": "postcreateteam"
        }
    },

    "topic_create": {
        "exchanges": {
            "teams": "topic.#.create.#"
        }
    },

    "topic_index": {
        "exchanges": {
            "teams": "topic.#.index.#"
        }
    },

    "topic_delete": {
        "exchanges": {
            "teams": "topic.#.delete.#"
        }
    },

    "topic_edit": {
        "exchanges": {
            "teams": "topic.#.edit.#"
        }
    },

    "topic_suspend_active_notification": {
        "exchanges": {
            "notifications": "topic_suspend_or_active"
        }
    },

    "topic_delete_notification": {
        "exchanges": {
            "notifications": "topic_delete"
        }
    },

    "topic_add_remove_member_notification": {
        "exchanges": {
            "notifications": "topic_add_or_remove_member"
        }
    },

    "topic_lastpost": {
        "exchanges": {
            "teams": "post.#.create.#.topic.#.lastpost.#"
        }
    },

    "topic_view": {
        "exchanges": {
            "teams": "post.#.create.#.topic.#.view.#"
        }
    },

    "team_file_link": {
        "exchanges": {
            "teams": "post.#.fileLink.#"
        }
    },

    "post_create": {
        "exchanges": {
            "teams": "post.#.create.#"
        }
    },

    "post_index": {
        "exchanges": {
            "teams": "post.#.index.#"
        }
    },

    "post_delete": {
        "exchanges": {
            "teams": "post.#.delete.#"
        }
    },

    "post_update": {
        "exchanges": {
            "teams": "post.#.update.#"
        }
    },

    "post_expiry": {
        "exchanges": {
            "teams": "post.#.expiry.#"
        }
    },

    "expire_post": {},

    "comment_expiry": {
        "exchanges": {
            "teams": "post.#.commentExpiry.#"
        }
    },

    "comment_count": {
        "exchanges": {
            "teams": "post.#.comment.#"
        }
    },

    "expire_comment": {},

    "post_email": {
        "exchanges": {
            "teams": "post.#.email.#"
        }
    },

    "alert_post": {
        "exchanges": {
            "teams": "post.#.alert.#"
        }
    },

    "alert_post_action": {
        "exchanges": {
            "teams": "alert.#.action.#"
        }
    },

    "alert_post_ack": {
        "exchanges": {
            "teams": "alert.#.ack.#"
        }
    },

    "post_delete_s3file": {
        "exchanges": {
            "teams": "post.#.deletefile.#"
        }
    },

    "topicInt_email_create": {
        "exchanges": {
            "teams": "integration.#.create.#"
        }
    },

    "topicInt_email_edit": {
        "exchanges": {
            "teams": "integration.#.edit.#"
        }
    },

    "topicInt_email_delete": {
        "exchanges": {
            "teams": "integration.#.delete.#"
        }
    },

    "post_validate_email": {
        "exchanges": {
            "teams": "post.#.validate.#"
        }
    },    

    "post_ss_notification": {
        "exchanges": {
            "notifications": "post_screenshot"
        }
    },

    "action_ack_notification": {
        "exchanges": {
            "notifications": "action_ack"
        }
    },

    "post_publish": {
        "exchanges": {
            "teams": "post"
        }
    },

    "comment_publish": {
        "exchanges": {
            "teams": "comment"
        }
    },

    "profile_thumbnails": {
        "exchanges": {
            "thumbnails": "profile"
        }
    },


    "acct_creation": {
        "exchanges": {
            "account_migration": "actcreation"
        }
    },

    "removeFromOrgGroups": {
        "exchanges": {
            "account_migration": "removeFromOrgGroups"
        }
    },

    "removeRolesOfUser": {
        "exchanges": {
            "account_migration": "removeRolesOfUser"
        }
    },

    "assgn_acct_license": {
        "exchanges": {
            "account_migration": 'assgnactlicense'
        }
    },

    "update_IdTo_acct": {
        "exchanges": {
            "account_migration": "updateIdToAct"
        }
    },

    "update_q_user": {
        "exchanges": {
            "account_migration": "updateuser"
        }
    },

    "deactivateUser": {
        "exchanges": {
            "account_cancellation": "deactivateUser"
        }
    },

    "reactivateUser": {
        "exchanges": {
            "account_reactivation": "reactivateUser"
        }
    },

    "like_post_notification": {
        "exchanges": {
            "notifications": "like_post"
        }
    },

    "comment_notification": {
        "exchanges": {
            "notifications": "comment"
        }
    },

    "mention_notification": {
        "exchanges": {
            "notifications": "mention"
        }
    },

    "addToPendingList":{
        "exchanges": {
            "assign_license": "addToPendingList"
        }
    },

    "assignToPendingUsers":{
        "exchanges": {
            "assign_license": "assignToPendingUsers"
        }
    },

    "removeAccount":{
        "exchanges": {
            "assign_license": "removeAccount"
        }
    },

    "updateIdToAccount":{
        "exchanges": {
            "assign_license": "updateIdToAccount"
        }
    },

    "addToEveryoneGroup":{
        "exchanges": {
            "assign_license": "addToEveryoneGroup"
        }
    },

    "updateUserProfile":{
        "exchanges": {
            "assign_license": "updateUserProfile"
        }
    },

    "assignLicense_removeUserToken":{
        "exchanges": {
            "assign_license": "assignLicense_removeUserToken",
        }
    },

    "accountMigration_removeUserToken":{
        "exchanges": {
            "account_migration": "accountMigration_removeUserToken",
        }
    },

    "accountCancellation_removeUserToken":{
        "exchanges": {
            "account_cancellation": "accountCancellation_removeUserToken"
        }
    },

    "timeline_topic_name": {
        "exchanges": {
            "teams": "topic.#.name.#"
        }
    },

    "timeline_topic_purpose": {
        "exchanges": {
            "teams": "topic.#.purpose.#"
        }
    },

    "timeline_topic_add_member": {
        "exchanges": {
            "teams": "topic.#.addmember.#"
        }
    },

    "timeline_topic_remove_member": {
        "exchanges": {
            "teams": "topic.#.removemember.#"
        }
    },

    "timeline_topic_member_left": {
        "exchanges": {
            "teams": "topic.#.memberleft.#"
        }
    },

    "timeline_thread_subject_change": {
        "exchanges": {
            "publish_timeline": "thread.#.subject.#"
        }
    },

    "timeline_thread_subject_lock_change": {
        "exchanges": {
            "publish_timeline": "thread.#.subject.#.lock.#"
        }
    },

    "timeline_thread_add_member": {
        "exchanges": {
            "publish_timeline": "thread.#.add.#.member.#"
        }
    },

    "timeline_thread_remove_member": {
        "exchanges": {
            "publish_timeline": "thread.#.remove.#.member.#"
        }
    },

    "timeline_thread_member_left": {
        "exchanges": {
            "publish_timeline": "thread.#.member.#.left.#"
        }
    },

    "timeline_thread_owner_change": {
        "exchanges": {
            "publish_timeline": "thread.#.owner.#"
        }
    },

    "timeline_thread_member_lock_change": {
        "exchanges": {
            "publish_timeline": "thread.#.member.#.lock.#"
        }
    },  

    "threads_sync_email" : {
        "exchanges" : {
            "threads" : "threads.#.syncemail.#"
        }
    },

    "threads_create_email" : {
        "exchanges" : {
            "threads" : "threads.createemail"
        }
    },

    "threads_email" : {
        "exchanges" : {
            "threads" : "threads.email"
        }
    },

    "removeUserContext":{
        "exchanges" : {
            "userContext" : "removeUserContext"
        }
    },

    "removeUserContextByMatchCond":{
        "exchanges" : {
            "userContext" : "removeUserContextByMatchCond"
        }
    },

    "users_purgeuser": {
        "exchanges": {
            "users": "purgeuser"
        }
    },

    "msg_control_notification": {
        "exchanges": {
            "msg_rule_notification": "msg_rule_change"
        }
    },

    "unread_msgs_in_thread" : {}
};
