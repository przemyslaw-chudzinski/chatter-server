const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const NotificationModel = require('../../../db/models/notification.model');
const wsActions = require('../../../ws-actions/ws-server-actions');

const _sendNotification = Symbol();
const _mapRecipientsIds = Symbol();
const _sendResponse = Symbol();

class DeleteChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        const {id} = this.req.params;
        if (!id) throw new Error('Id param is required');

        ChannelModel.getById(id)
            .then(channelModel => {
                if (channelModel.authorId !== this.loggedUserId) return this.simpleResponse('No permissions for this operation', 403);

                channelModel.deleteById()
                    .then(() => this[_sendNotification](channelModel))
                    .catch(err => this.simpleResponse('Internal server error. Cannot remove channel', 500, err));

            }).catch(err => this.simpleResponse('Internal server error. Cannot get channel by id', 500, err));
    }

    [_sendNotification](channelModel) {
        const notification = new NotificationModel();
        notification.authorId = this.loggedUserId;
        notification.message = 'Channel ' + channelModel.name + ' was removed by author';
        notification.recipientIds = this[_mapRecipientsIds](channelModel);
        notification.extra.confirmable = true;
        notification.extra.channelId = channelModel._id;

        notification.save()
            .then(notification => {
                delete notification.recipientIds;
                channelModel.members.forEach(member => {
                    !member.confirmed && this.wsServer.sendToOne(member.memberId, JSON.stringify({
                        action: wsActions.ReceivedNotification,
                        data: notification
                    }));
                });
                this[_sendResponse](channelModel);
            }).catch(err => this.simpleResponse(500, 'Internal server error. Cannot create notification', err));
    }

    [_mapRecipientsIds](channelModel) {
        return channelModel.members.map(member => member.memberId !== this.loggedUserId ? member.memberId : null).filter(i => !!i);
    }

    [_sendResponse](channel) {
        this.res.status(200);
        this.res.json({
            data: channel,
            message: "Channel has been deleted",
            error: false
        });
    }
}

module.exports = DeleteChannelAction;
