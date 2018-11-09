const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');
const UserResource = require('../../../resources/user.resource');

class GetUsersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._userResource = new UserResource;
    }

    action() {
        UserModel.all(this.loggedUserId)
            .then(usersCollection => {
                this.res.status(200);
                this.res.json(this._userResource.collection(usersCollection));
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = GetUsersAction;