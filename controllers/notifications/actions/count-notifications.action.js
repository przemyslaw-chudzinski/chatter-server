const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');

class CountNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        NotificationModel.countUnreadNotifications(this.loggedUserId)
            .then(unread => this.res.json({ unread }))
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = CountNotificationsAction;