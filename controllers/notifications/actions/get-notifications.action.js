const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');

class GetNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        NotificationModel.all(this.loggedUserId)
            .then(notifications => this.res.json(notifications))
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetNotificationsAction;