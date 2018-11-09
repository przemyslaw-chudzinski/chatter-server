const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/message.model');
const UserModel = require('../../../db/models/user.model');
const MessageResource = require('../../../resources/message.resource');
const UserResource = require('../../../resources/user.resource');

class GetMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._messageResource = new MessageResource();
        this._userResource = new UserResource();
    }

    action() {
        const recipientId = this.req.params.recipientId;

        UserModel.getById(recipientId)
            .then(author => {
                author = this._userResource.singular(author);
                MessagesModel.all(this.loggedUserId, recipientId)
                    .then(messagesCollection => {
                        this.res.status(200);
                        this.res.json(this._messageResource.collection(messagesCollection, {author}));
                    })
                    .catch(err => this.simpleResponse(500, 'Internal server error', err));
            })
            .catch(err => this.simpleResponse('Wrong user id has been passed', 404, err));


    }
}

module.exports = GetMessagesAction;