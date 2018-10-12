const ActionBase = require('../../action-base');
const ChannelsModel = require('../../../db/models/channels.model');
const NotificationsModel = require('../../../db/models/notifications.model');
const wsActions = require('../../../ws-actions/ws-server-actions');

class SaveChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._channelsModel = new ChannelsModel;
        this._notificationsModel = new NotificationsModel();
        this._init();
    }

    _init() {

        this.req.body.memberIds.push(this.loggedUserId);

        const payload = {
            name: this.req.body.name,
            authorId: this.loggedUserId,
            members: this.req.body.memberIds.map(member => {
                const _result = {
                    memberId: member,
                    confirmed: false,
                    confirmedAt: null
                };
                if (member === this.loggedUserId) {
                    _result.confirmed = true;
                }
                return _result;
            }),
            createdAt: new Date()
        };

        this
            ._channelsModel
            .saveChannel(payload)
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
}

module.exports = SaveChannelAction;