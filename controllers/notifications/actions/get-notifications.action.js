const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');
const NotificationResource = require('../../../resources/notification.resource');
const async = require('async');
const UserModel = require('../../../db/models/user.model');

class GetNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._notificationResource = new NotificationResource;
    }

    action() {
        NotificationModel.all(this.loggedUserId)
            .then(notificationsCollection => {
                async.map(notificationsCollection.items, (notification, next) => {
                    UserModel.getById(notification.authorId)
                        .then(author => {
                            if (author) {
                                notification.author = author;
                                next(null, notification);
                            }
                        }).catch(err => next(err));
                }, (err, results) => {
                    if (err) return this.simpleResponse('Internal server error 1', 500, err);
                    notificationsCollection.items = results;
                    this.res.status(200);
                    this.res.json(this._notificationResource.collection(notificationsCollection));
                });
            })
            .catch(err => this.simpleResponse(500, 'Internal server error 2', err));
    }
}

module.exports = GetNotificationsAction;
