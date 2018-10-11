const ActionBase = require('../../action-base');


class SaveChannelAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        this.res.json({error: false, message: 'No message'});
    }
}

module.exports = SaveChannelAction;