const ActionBase = require('../../action-base');


class GetChannelsAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        this.res.json({error: false, message: 'get channels'});
    }
}

module.exports = GetChannelsAction;