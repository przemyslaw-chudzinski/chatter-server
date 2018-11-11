const ActionBase = require('../../action-base');
const NotificationModel = require('../../../db/models/notification.model');
const NotificationResource = require('../../../resources/notification.resource');

class GetNotificationsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._notificationResource = new NotificationResource;
    }

    action() {
        NotificationModel.all(this.loggedUserId)
            .then(notificationsCollecton => this.res.json(this._notificationResource.collection(notificationsCollecton)))
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetNotificationsAction;