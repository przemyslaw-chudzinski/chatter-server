const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');
const ChannelResource = require('../../../resources/channel.resource');

class GetChannelsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._channelResource = new ChannelResource;
    }

    action() {
        ChannelModel.all(this.loggedUserId)
            .then(channelsCollection => {
                this.res.status(200);
                this.res.json(this._channelResource.collection(channelsCollection));
            })
            .catch(err => this.simpleResponse('Internal server error !!!!', 500, err));
    }
}

module.exports = GetChannelsAction;