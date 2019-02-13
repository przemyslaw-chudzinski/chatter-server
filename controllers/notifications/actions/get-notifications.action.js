const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');
const NotificationResource = require('../../../resources/notification.resource');
const async = require('async');
const UserModel = require('../../../db/models/user.model');
const ChannelModel = require('../../../db/models/channel.model');

class GetNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._notificationResource = new NotificationResource;
    }

    // TODO: fix logic responsible for getting data. Here is a problem when channel doesn't exist;
    action() {
        NotificationModel.all(this.loggedUserId)
            .then(notificationsCollection => {
                async.map(notificationsCollection.items, (notification, next) => {
                    UserModel.getById(notification.authorId)
                        .then(author => {
                            if (author) {
                                notification.author = author;
                                if (notification.extra && notification.extra.confirmable && notification.extra.channelId) {
                                    this._isConfirmable(notification.extra.channelId, this.loggedUserId)
                                        .then(confirmed => {
                                            notification.extra.confirmed = confirmed;
                                            next(null, notification);
                                        })
                                        .catch(err => next(err));
                                } else next(null, notification);
                            }
                        })
                        .catch(err => next(err));
                }, (err, results) => {
                    if (err) return this.simpleResponse('Internal server error', 500, err);
                    notificationsCollection.items = results;
                    this.res.status(200);
                    this.res.json(this._notificationResource.collection(notificationsCollection));
                });
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }

    _isConfirmable(channelId, memberId) {
        return new Promise((resolve, reject) => {
            ChannelModel.getById(channelId)
                .then(channel => {
                    const member = channel.members.find(i => i.memberId === memberId);
                    resolve(member ? member.confirmed : false);
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = GetNotificationsAction;
