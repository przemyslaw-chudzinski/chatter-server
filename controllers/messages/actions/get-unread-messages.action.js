const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');
const UnreadMessageResource = require('../../../resources/unread-message.resource');

class GetUnreadMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._unreadMessageResource = new UnreadMessageResource;
    }

    action() {
        MessagesModel.getUnreadMessages(this.loggedUserId).then(unreadMessagesCollection => {
            this.res.status(200);
            this.res.json(this._unreadMessageResource.collection(unreadMessagesCollection));
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUnreadMessagesAction;