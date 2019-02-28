const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');

class ResetUnreadMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        if (!this.loggedUserId) throw new Error('user is not logged');
        try {
            await MessagesModel.resetUnreadMessages(this.req.params.contactId);
            this.simpleResponse('Messages has been set as read successfully', 200);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = ResetUnreadMessagesAction;
