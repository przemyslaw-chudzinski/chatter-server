const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class GetLoggedUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        if (!this.loggedUserId) throw new Error('id is required');
        UserModel.getById(this.loggedUserId)
            .then(user => {
                if (user) {
                    this.res.status(200);
                    this.res.json(user);
                    return;
                }
                this.simpleResponse(404, 'User not found');
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }

}

module.exports = GetLoggedUserAction;