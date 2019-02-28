const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');

class GetChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        const {id} = this.req.params;
        if (!id) throw new Error('id is required');
        try {
            const channelModel = await ChannelModel.getById(id);
            this.simpleResponse(null, 200, channelModel);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = GetChannelAction;
