const SaveMessageAction = require('./actions/save-message.action');
const GetMessagesAction = require('./actions/get-messages.action');
const UpdateMessageAction = require('./actions/update-message.action');
const GetUnreadMessagesAction = require('./actions/get-unread-messages.action');
const ResetUnreadMessagesAction = require('./actions/reset-unread-messages.action');

module.exports = {
    SaveMessageAction,
    GetMessagesAction,
    UpdateMessageAction,
    GetUnreadMessagesAction,
    ResetUnreadMessagesAction
};