const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');

class UpdateStatusMessageAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._messagesModel = new MessagesModel(req, res);
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
        if (!this.req.body._id) {
            throw new Error('payload data is incorrect');
        }
    }

}

module.exports = UpdateStatusMessageAction;