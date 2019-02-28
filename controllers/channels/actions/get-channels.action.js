const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');

class GetChannelsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const channelsCollection = await ChannelModel.all(this.loggedUserId);
            this.simpleResponse(null, 200, channelsCollection.items);
        } catch (e) {
            this.simpleResponse('Internal server error')
        }
    }
}

module.exports = GetChannelsAction;
