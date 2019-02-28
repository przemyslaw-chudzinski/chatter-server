const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');
const UserResource = require('../../../resources/user.resource');

class GetUsersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
        this._userResource = new UserResource;
    }

    async action() {
        try {
            const usersCollection = await UserModel.all(this.loggedUserId);
            this.res.status(200);
            this.res.json(this._userResource.collection(usersCollection));
            return usersCollection;
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = GetUsersAction;
