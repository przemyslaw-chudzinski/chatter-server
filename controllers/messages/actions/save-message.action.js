const ActionBase = require('../../action-base');

class SaveMessageAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        console.log('SaveMessageAction called');
    }
}

module.exports = SaveMessageAction;