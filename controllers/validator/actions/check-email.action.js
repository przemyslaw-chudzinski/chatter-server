const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/users.model');

class CheckEmailAction extends ActionBase {
    constructor(req, res) {
        super();
        this._req = req;
        this._res = res;
        this._userModel = new UserModel();
        this._init();
    }

    _init() {
        this._userModel.getUserByEmail(this._req.body.email)
            .then(user => {
                if (user && user.email === this.loggeduserEmail) {
                    console.log('1', this._req.body.email);
                    return this._res.json(null);
                } else if (!user) {
                    console.log('2', this._req.body.email);
                    return this._res.json(null);
                } else {
                    console.log('3', this._req.body.email);
                    return this._res.json({
                        isTaken: true
                    });
                }
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err))
    }
}

module.exports = CheckEmailAction;