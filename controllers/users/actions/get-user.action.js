const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');

class GetUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        this._userModel.getUserById(this.req.params.id).then(data => {
            if (data) {
                this.res.status(200);
                this.res.json(data);
                return;
            }
            this.simpleResponse(404, 'User not found');
        }).catch(err => this.simpleResponse(500, 'Inernal server error', err))
    }

}

module.exports = GetUserAction;