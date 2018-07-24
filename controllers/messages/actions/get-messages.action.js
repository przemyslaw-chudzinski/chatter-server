const ActionBase = require('../../action-base');
const MessagesModel = require('../../../db/models/messages.model');
const UsersModel = require('../../../db/models/users.model');
const async = require('async');

class GetMessagesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._messagesModel = new MessagesModel(req, res);
        this._usersModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        if (!this._req.params.recipientId) {
            throw new Error('recipientId route param is required');
        }
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }


        const query = {
            $or: [{
                authorId: this.loggedUserId,
                recipientId: this._req.params.recipientId
            }, {
                authorId: this._req.params.recipientId,
                recipientId: this.loggedUserId
            }]
        };

        const filter = {
            limit: this._req.query.limit || 50
        };

        this._messagesModel.getMessages(query, filter).then(data => {
            async.map(data.results, (item, next) => {
                this._usersModel.getUserById(item.authorId).then(author => {
                    item.author = author;
                    next(false, item);
                }).catch(err => next(err));
            }, (err, results) => {
                if (err) {
                    return this.simpleResponse(500, 'Internal server error', err);
                }
                data.results = results;
                this._res.status(200);
                this._res.json(data);
            });
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetMessagesAction;