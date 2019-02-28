const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class GetUsersAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const usersCollection = await UserModel.all(this.loggedUserId);
            this.simpleResponse(null, 200, usersCollection.items);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = GetUsersAction;
