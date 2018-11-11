const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');
const UserModel = require('../../../db/models/user.model');
const MessageResource = require('../../../resources/message.resource');
const UserResource = require('../../../resources/user.resource');
const async = require('async');

class GetMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._messageResource = new MessageResource();
        this._userResource = new UserResource();
    }

    action() {
        const recipientId = this.req.params.recipientId;

        MessagesModel.all(this.loggedUserId, recipientId)
            .then(messagesCollection => {
                async.map(messagesCollection.items, (message, next) => {
                    UserModel.getById(message.authorId)
                        .then(author => {
                            if (author) {
                                message.author = this._userResource.singular(author);
                                next(null, message);
                            }
                        })
                        .catch(err => this.simpleResponse('Internal server error', 500, err));

                }, (err, results) => {
                    messagesCollection.items = results;
                    this.res.status(200);
                    this.res.json(this._messageResource.collection(messagesCollection));
                });
            })
            .catch(err => this.simpleResponse('Internal server error', 500, err));
    }
}

module.exports = GetMessagesAction;