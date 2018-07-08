const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');

class GetUsersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        this._userModel.getUsers().then(data => this._resolveHandler(data)).catch(err => this.__rejectHandler(err));
    }

    _resolveHandler(data) {
        return this._res.json(data);
    }

    _rejectHandler(err) {
        console.log('error');
        return this.internalServerErrorHandler(err);
    }
}

module.exports = GetUsersAction;