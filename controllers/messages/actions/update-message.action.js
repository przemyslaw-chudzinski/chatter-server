const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');

class UpdateMessageAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
        if (!this.req.body._id) {
            throw new Error('payload data is incorrect');
        }

        MessagesModel.getById(this.req.body._id)
            .then(message => {
                if (message.isAuthor(this.loggedUserId)) {
                    this.req.body.content ? message.content = this.req.body.content : null;
                    message.update()
                        .then(message => {
                            this.res.status(200);
                            this.res.json({
                                data: message,
                                message: "Message has been updated",
                                error: false
                            });
                            this.wsServer.notifyContactMessageUpdated(message);
                        })
                        .catch(err => this.simpleResponse(500, 'Internal server error', err));
                }
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = UpdateMessageAction;