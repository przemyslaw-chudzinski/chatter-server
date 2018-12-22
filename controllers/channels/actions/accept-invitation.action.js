const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const NotificationModel = require('../../../db/models/notification.model');
// const wsActions = require('../../../ws-actions/ws-server-actions');

class AcceptInvitationAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        // TODO: Put validators rules!!!
        const {notificationId} = this.req.body;
        if (!notificationId) throw new Error ('notificationId is required');

        NotificationModel.getById(notificationId)
            .then(({extra}) => {
                extra && extra.channelId ?
                    this._acceptChannelInvitation(extra.channelId)
                    : this.simpleResponse('channelId is not recognized', 500 , null);
            }).catch(err => this.simpleResponse('Something went wrong', 500 , err));
    }

    _acceptChannelInvitation(channelId) {
        ChannelModel.getById(channelId)
            .then(channel => {
                const _channelModel = new ChannelModel(channel);
                _channelModel.acceptInvitation(this.loggedUserId.toString())
                    .then(channel => {
                        this.res.status(200);
                        this.res.json({});
                    }).catch(err => this.simpleResponse(err.reason, 500 , err))
            }).catch(err => this.simpleResponse(err.reason, 500 , err))
    }
}

module.exports = AcceptInvitationAction;
