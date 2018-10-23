const ActionBase = require('../../action-base');
const NotificationsModel = require('../../../db/models/notifications.model');

class CountNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._notificationsModel = new NotificationsModel();
        this._init();
    }

    _init() {
        this
            ._notificationsModel
            .countUnreadNotifications(this.loggedUserId)
            .then(unread => this.res.json({ unread }))
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = CountNotificationsAction;