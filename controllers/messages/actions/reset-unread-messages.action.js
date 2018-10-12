const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');

class ResetUnreadMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._messagesModel = new MessagesModel();
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
        this._messagesModel.resetUnreadMessages(this.req.params.contactId)
            .then(() => this.simpleResponse(200, 'Messages has been set as read successfully', false))
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = ResetUnreadMessagesAction;