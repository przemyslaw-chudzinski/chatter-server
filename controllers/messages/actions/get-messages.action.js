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
        this._messagesModel.getMessages(this._req.params.id).then(data => this._resloveHandler(data)).catch(err => this._catchHandler(err));
    }

    _resloveHandler(data) {
        async.map(data.results, (msg, next) => {
            return this._usersModel.getUserById(msg.authorId).then(user => {
                msg.author = user;
                next(false, msg);
            }).catch();
        }, (err, results) => {
            if (err) {
                return;
            }
            this._res.status(200);
            return this._res.json(data);
        })
    }

    _catchHandler(err) {
        console.log('error');
        return this.internalServerErrorHandler(err);
    }
}

module.exports = GetMessagesAction;