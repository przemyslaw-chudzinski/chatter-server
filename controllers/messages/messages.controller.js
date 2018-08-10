const SaveMessageAction = require('./actions/save-message.action');
const GetMessagesAction = require('./actions/get-messages.action');
const UpdateMessageAction = require('./actions/update-message.action');
const UpdateStatusMessageAction = require('./actions/update-status-message.action');

module.exports = {
    SaveMessageAction: SaveMessageAction,
    GetMessagesAction: GetMessagesAction,
    UpdateMessageAction: UpdateMessageAction,
    UpdateStatusMessageAction: UpdateStatusMessageAction
};