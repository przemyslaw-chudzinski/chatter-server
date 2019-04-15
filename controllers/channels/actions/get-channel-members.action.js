const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');

class GetChannelMembersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        const channelId = this.req.params.id;

        try {
            const channel = await ChannelModel.getById(channelId);
            const decodedMembers = await channel.decodeMembers([this.loggedUserId]);
            console.log(decodedMembers);
            this.simpleResponse(null, 200, decodedMembers);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = GetChannelMembersAction;
