const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');

class CountNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const unread = await NotificationModel.countUnreadNotifications(this.loggedUserId);
            this.simpleResponse(null, 200, unread);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = CountNotificationsAction;
