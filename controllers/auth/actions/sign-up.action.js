const passwordHash = require('password-hash');
const db = require('../../../db/db');

class SignUpAction {
    constructor(req, res) {
        this._req = req;
        this._res = res;
        this._init();
    }

    _init() {

    }
}

module.exports = SignUpAction;