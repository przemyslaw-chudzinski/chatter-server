const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');

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
            this._res.status(200);
            this._res.json(data);
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUnreadMessagesAction;