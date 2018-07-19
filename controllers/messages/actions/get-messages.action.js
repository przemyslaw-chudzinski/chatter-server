const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');
const UsersModel = require('../../../db/models/users.model');

class GetMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._messagesModel = new MessagesModel(req, res);
        this._usersModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        this._messagesModel.getMessages(this.loggedUserId, this._req.params.recipientId).then(data => {
            this._res.status(200);
            this._res.json(data);
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetMessagesAction;