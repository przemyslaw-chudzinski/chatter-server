const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');
const async = require('async');

class ResetUnreadNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const notificationCollection = await NotificationModel.all(this.loggedUserId);
            async.each(notificationCollection.items, async function (notification, next) {
                notification.read = true;
                notification.readAt = new Date();
                await notification.update();
                next();
            }, () => this.simpleResponse(null, 200));
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = ResetUnreadNotificationsAction;
