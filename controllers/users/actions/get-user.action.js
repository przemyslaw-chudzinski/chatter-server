const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/user.model');

class GetUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        UsersModel.getById(this.req.params.id).then(data => {
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