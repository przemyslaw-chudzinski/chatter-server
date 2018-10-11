const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');

class SaveMessageAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._messagesModel = new MessagesModel(req, res);
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
        const message = this.req.body;
        message.authorId = this.loggedUserId;
        message.read = false;
        message.readAt = null;

        this
            ._messagesModel
            .saveMessage(message)
            .then(message => {
                this.res.status(200);
                this.res.json({
                    data: message,
                    message: "Message has been created",
                    error: false
                });
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = SaveMessageAction;