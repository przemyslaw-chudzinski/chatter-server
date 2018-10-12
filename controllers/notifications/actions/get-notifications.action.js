const ActionBase = require('../../action-base');
const NotificationsModel = require('../../../db/models/notifications.model');

class GetNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._notificationsModel = new NotificationsModel();
        this._init();
    }

    _init() {
        this
            ._notificationsModel
            .getNotifications(this.loggedUserId)
            .then(notifications => this.res.json(notifications))
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetNotificationsAction;