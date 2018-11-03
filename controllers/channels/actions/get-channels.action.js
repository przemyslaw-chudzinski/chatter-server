const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');


class GetChannelsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        ChannelModel.all(this.loggedUserId)
            .then(channels => {
                this.res.status(200);
                this.res.json(channels)
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetChannelsAction;