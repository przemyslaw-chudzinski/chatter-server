const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const NotificationModel = require('../../../db/models/notification.model');
const channelExtra = require('./channel-extra');
const {ChannelHasBeenCreated} = require('../../../ws-actions/ws-server-actions');

const _sendNotification = Symbol();
const _prepareNotification = Symbol();
const _prepareChannel = Symbol();
const _getMembers = Symbol();
const _updateChannelsLists = Symbol();

class SaveChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        const channelModel = this[_prepareChannel]();
        try {
            const savedChannelModel = await channelModel.save();
            this[_sendNotification](savedChannelModel);
            this[_updateChannelsLists](savedChannelModel);
            this.simpleResponse('Channel has been created', 200, savedChannelModel);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

    /**
     *
     * @param channelModel
     */
    async [_sendNotification](channelModel) {
        const notificationModel = this[_prepareNotification](channelModel);
        try {
            const notification = notificationModel.save();
            delete notification.recipientIds;
            channelExtra.notifyMembers.call(this, channelModel.members, notification);
            return notification
        } catch (e) {
            throw new Error('Problem with saving notification');
        }
    }

    /**
     * @returns {ChannelModel}
     */
    [_prepareChannel]() {
        const channelModel = new ChannelModel();
        channelModel.name = this.req.body.name;
        channelModel.authorId = this.loggedUserId;
        channelModel.members = this[_getMembers]();
        return channelModel;
    }

    /**
     *
     * @param channelModel
     * @returns {NotificationModel}
     */
    [_prepareNotification](channelModel) {
        const notification = new NotificationModel();
        notification.authorId = this.loggedUserId;
        notification.message = 'You have been invited to group chat **' + channelModel.name + '**';
        notification.recipientIds = channelExtra.mapRecipientsIds.call(this, channelModel.members, this.loggedUserId);
        return notification;
    }

    /**
     * @returns {{confirmedAt: null, confirmed: boolean, memberId: *}[]}
     */
    [_getMembers]() {
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

    /**
     * @param channelModel
     */
    [_updateChannelsLists](channelModel) {
        const recipients = channelModel.members.filter(member => member._id !== this.loggedUserId);
        channelExtra.notifyMembers.call(this, recipients, channelModel, ChannelHasBeenCreated);
    }
}

module.exports = SaveChannelAction;
