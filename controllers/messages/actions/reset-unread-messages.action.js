const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');

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
            .then(() => this.simpleResponse('Messages has been set as read successfully', 200, false))
            .catch(err => this.simpleResponse('Internal server error', 500, err));
    }
}

module.exports = ResetUnreadMessagesAction;