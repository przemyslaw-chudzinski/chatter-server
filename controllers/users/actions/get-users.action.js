const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');
const database = require('../../../db/db');

class GetUsersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel;
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('loggedUserId is required parameter');
        }
        const query = {
            _id: {
                $ne: database.dbDriver.ObjectId(this.loggedUserId)
            }
        }

        const filter = {
            limit: 10
        };

        this._userModel.getUsers(query, filter).then(data => {
            this._res.status(200);
            this._res.json(data);
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUsersAction;