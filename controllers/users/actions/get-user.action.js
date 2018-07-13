const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');

class GetUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        this._userModel.getUserById(this._req.params.id).then(data => this._resloveHandler(data)).catch(err => this._catchHandler(err));
    }

    _resloveHandler(data) {
        return this._res.json(data);
    }

    _catchHandler(err) {
        console.log('error');
        return this.internalServerErrorHandler(err);
    }
}

module.exports = GetUserAction;