const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const NotificationModel = require('../../../db/models/notification.model');
const {mapRecipientsIds, notifyUnconfirmedMembers} = require('./channel-extra');
const {ChannelHasBeenDeleted} = require('../../../ws-actions/ws-server-actions');

// Symbols for private members
const _sendNotification = Symbol();
const _deleteChannel = Symbol();
const _prepareNotification = Symbol();
const _updateChannelsLists = Symbol();

class DeleteChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        const {id} = this.req.params;
        if (!id) throw new Error('Id param is required');
        try {
            const channelModel = await ChannelModel.getById(id);
            if (channelModel.authorId !== this.loggedUserId) return this.simpleResponse('No permissions for this operation', 403);
            await this[_deleteChannel](channelModel);
            this[_updateChannelsLists](channelModel);
            this.simpleResponse('Channel has been deleted', 200, channelModel);
        } catch (e) {
            this.simpleResponse('Internal server error. Cannot get channel by id', 500);
        }
    }

    /**
     * @param model
     * @returns {Promise<*>}
     */
    async [_deleteChannel](model) {
        try {
            await model.deleteById();
            this[_sendNotification](model);
            return model;
        } catch (e) {
            throw new Error('Internal server error. Cannot delete channel');
        }
    }

    /**
     * @param channelModel
     * @returns {Promise<*>}
     */
    async [_sendNotification](channelModel) {
        const notificationModel = this[_prepareNotification](channelModel);
        try {
            const notification = await notificationModel.save();
            delete notification.recipientIds;
            notifyUnconfirmedMembers.call(this, channelModel.members, notification);
            return notificationModel;
        } catch (e) {
            throw new Error('Internal server error. Cannot send notifications');
        }
    }

    /**
     * @param channelModel
     * @returns {NotificationModel}
     */
    [_prepareNotification](channelModel) {
        const notification = new NotificationModel();
        notification.authorId = this.loggedUserId;
        notification.message = 'Channel ' + channelModel.name + ' was removed by author';
        notification.recipientIds = mapRecipientsIds.call(this, channelModel.members, this.loggedUserId);
        notification.extra.confirmable = true;
        notification.extra.channelId = channelModel._id;
        return notification;
    }

    /**
     * @param channelModel
     */
    [_updateChannelsLists](channelModel) {
        const payload = JSON.stringify({action: ChannelHasBeenDeleted, data: channelModel});
        channelModel.members &&
        channelModel.members.length &&
        channelModel.members.forEach(member => this.wsServer.sendToOne(member.memberId, payload));
    }
}

module.exports = DeleteChannelAction;
