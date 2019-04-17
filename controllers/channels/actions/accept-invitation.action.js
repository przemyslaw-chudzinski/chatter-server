const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const NotificationModel = require('../../../db/models/notification.model');
const wsActions = require('../../../ws-actions/ws-server-actions');

const _prepareNotification = Symbol();
const _sendInformationToOwner = Symbol();
const _acceptChannelInvitation = Symbol();

class AcceptInvitationAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        // TODO: Put validators rules!!!
        const {channelId} = this.req.body;
        if (!channelId) throw new Error ('channelId is required');

        try {
            this[_acceptChannelInvitation](channelId, this.loggedUserId);
            this.simpleResponse('Invitation has been accepted', 200);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

    /**
     * @param channelId
     * @param loggedUserId
     * @returns {Promise<any>}
     */
    async [_acceptChannelInvitation](channelId, loggedUserId) {
       try {
           const channelModel = await ChannelModel.getById(channelId);
           const updatedChannelModel = await channelModel.acceptInvitation(loggedUserId);
           this[_sendInformationToOwner](updatedChannelModel);
           return channelModel;
       } catch (e) {
            throw new Error('Cannot mark invitation as accepted');
       }
    }

    /**
     * @param channelModel
     * @returns {Promise<*>}
     */
    async [_sendInformationToOwner](channelModel) {
        const notificationModel = this[_prepareNotification](channelModel);
        try {
            const savedNotificationModel = await notificationModel.save();
            this.wsServer.sendToOne(channelModel.authorId, JSON.stringify({
                action: wsActions.ReceivedNotification,
                data: savedNotificationModel
            }));
            return savedNotificationModel;
        } catch (e) {
            throw new Error('Cannot create notification');
        }
    }

    /**
     * @param channelModel
     * @returns {NotificationModel}
     */
    [_prepareNotification](channelModel) {
        const notification = new NotificationModel();
        notification.authorId = this.loggedUserId;
        notification.message = this.loggedUser.firstName + ' ' + this.loggedUser.lastName + ' accepted your invitation to the channel - **'  + channelModel.name + '**';
        notification.extra.confirmable = false;
        notification.extra.channelId = channelModel._id;
        notification.recipientIds = [channelModel.authorId];
        return notification
    }
}

module.exports = AcceptInvitationAction;
