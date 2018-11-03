const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const NotificationsModel = require('../../../db/models/notification.model');
const wsActions = require('../../../ws-actions/ws-server-actions');

class SaveChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._notificationsModel = new NotificationsModel();
        this._init();
    }

    _init() {

        const channel = new ChannelModel();

        channel.name = this.req.body.name;
        channel.authorId = this.loggedUserId;
        channel.members = this.members;
        channel.save()
            .then(channel => {
                this._sendNotification(channel);
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }

    _sendNotification(channel) {
        const payload = {
            authorId: this.loggedUserId,
            message: 'You have been invited to group chat **' + channel.name + '**',
            recipientIds: channel.members.map(member => {
                if (member.memberId !== this.loggedUserId) {
                    return member.memberId;
                }
            }).filter(i => !!i)
        };
        this
            ._notificationsModel
            .saveNotification(payload)
            .then(notification => {
                delete notification.recipientIds;
                channel.members.forEach(member => {
                    !member.confirmed && this.wsServer.sendToOne(member.memberId, JSON.stringify({
                        action: wsActions.ReceivedNotification,
                        data: notification
                    }));
                });
                this._sendResponse(channel);
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }

    _sendResponse(channel) {
        this.res.status(200);
        this.res.json({
            data: channel,
            message: "Channel has been created",
            error: false
        });
    }

    get members() {
        const membersIds = [...this.req.body.memberIds, this.loggedUserId];
        return membersIds.map(memberId => {
            const result = {
                memberId,
                confirmed: false,
                confirmedAt: null
            };

            if (memberId === this.loggedUserId) {
                result.confirmed = true;
                result.confirmedAt = new Date();
            }

            return result;
        });
    }
}

module.exports = SaveChannelAction;