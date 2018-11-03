const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');

class GetUnreadMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._messagesModel = new MessagesModel();
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }

        this._messagesModel.getUnreadMessages(this.loggedUserId).then(data => {
            this.res.status(200);
            this.res.json(data);
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUnreadMessagesAction;