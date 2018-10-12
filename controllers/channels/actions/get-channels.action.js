const ActionBase = require('../../action-base');
const ChannelsModel = require('../../../db/models/channels.model');


class GetChannelsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._channelsModel = new ChannelsModel();
        this._init();
    }

    _init() {
        this._channelsModel.getChannels(this.loggedUserId)
            .then(channels => {
                this.res.status(200);
                this.res.json(channels)
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetChannelsAction;