const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');
const database = require('../../../db/index');

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
            this.res.status(200);
            this.res.json(data);
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUsersAction;