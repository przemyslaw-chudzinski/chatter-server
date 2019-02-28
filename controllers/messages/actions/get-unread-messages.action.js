const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');

class GetUnreadMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const unreadMessagesCollection = await MessagesModel.getUnreadMessages(this.loggedUserId);
            this.simpleResponse(null, 200, unreadMessagesCollection.items);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = GetUnreadMessagesAction;
