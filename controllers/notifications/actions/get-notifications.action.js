const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');
const async = require('async');
const UserModel = require('../../../db/models/user.model');

const _getAuthor = Symbol();

class GetNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const notificationsCollection = await NotificationModel.all(this.loggedUserId);
            async.map(notificationsCollection.items, (notification, next) => this[_getAuthor](notification, next), (err, results) => err ? this.simpleResponse('Internal server error', 500) : this.simpleResponse(null, 200, results));
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

    async [_getAuthor](notificationModel, next) {
        next = next || function () {};
        try {
            const author = await UserModel.getById(notificationModel.authorId);
            if (author) {
                notificationModel.author = author;
                next(null, notificationModel);
            }
        } catch (e) {
            throw new Error('Cannot get user by id');
        }
    }
}

module.exports = GetNotificationsAction;
