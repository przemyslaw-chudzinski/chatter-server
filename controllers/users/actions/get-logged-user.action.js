const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');

class GetLoggedUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('id is required');
        }
        this._userModel.getUserById(this.loggedUserId).then(data => {
            if (data) {
                this._res.status(200);
                this._res.json(data);
                return;
            }
            this.simpleResponse(404, 'User not found');
        }).catch(err => this.simpleResponse(500, 'Inernal server error', err))
    }

}

module.exports = GetLoggedUserAction;