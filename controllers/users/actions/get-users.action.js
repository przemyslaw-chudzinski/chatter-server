const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');

class GetUsersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel;
        this._init();
    }

    _init() {
        this._userModel.users(this.loggedUserId).then(data => {
            this._res.status(200);
            this._res.json(data);
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUsersAction;