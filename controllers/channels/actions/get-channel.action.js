const ActionBase = require('../../action-base');
const ChannelModel = require('../../../db/models/channel.model');

class GetChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        const {id} = this.req.params;
        if (!id) throw new Error('id is required');
        ChannelModel.getById(id)
            .then(data => {
                this.res.status(200);
                this.res.json(data);
            }).catch(err => this.simpleResponse('Internal server error !!!!', 500, err));
    }
}

module.exports = GetChannelAction;
