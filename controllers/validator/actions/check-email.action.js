const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class CheckEmailAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UserModel();
        this._init();
    }

    _init() {
        this._userModel.getUserByEmail(this.req.body.email.toLowerCase())
            .then(user => {
                if (user && user.email=== this.loggeduserEmail) {
                    return this._res.json(null);
                } else if (!user) {
                    return this._res.json(null);
                } else {
                    return this.res.json({
                        isTaken: true
                    });
                }
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err))
    }
}

module.exports = CheckEmailAction;