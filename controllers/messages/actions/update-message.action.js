const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');

class UpdateMessageAction extends ActionBase {
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
        this._userIsAuthor()
            .then(isAuthor => {
                isAuthor && this._messagesModel.updateMessage(this._req.body)
                    .then(message => {
                        this.res.status(200);
                        this.res.json({
                            data: message,
                            message: "Message has been updated",
                            error: false
                        });
                    })
                    .catch(err => this.simpleResponse(500, 'Internal server error', err));
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }

    _userIsAuthor() {
        return new Promise((resolve, reject) => {
            this._messagesModel.getMessageById(this.req.body._id)
                .then(result => resolve(result.authorId === this.loggedUserId))
                .catch(err => reject(err));
        });
    }
}

module.exports = UpdateMessageAction;