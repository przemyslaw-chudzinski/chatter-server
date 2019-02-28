const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');
const UserModel = require('../../../db/models/user.model');
const UserResource = require('../../../resources/user.resource');
const async = require('async');

class GetMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._userResource = new UserResource();
    }

    action() {
        const recipientId = this.req.params.recipientId;

        this.req.query.skip = parseInt(this.req.query.skip) || 0;
        this.req.query.take = parseInt(this.req.query.take) || 30;

        MessagesModel.paginate(this.loggedUserId, recipientId, this.req.query.take, this.req.query.skip)
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

                }, (err, results) => this.simpleResponse(null, 200, results));
            })
            .catch(() => this.simpleResponse('Internal server error', 500));
    }
}

module.exports = GetMessagesAction;
