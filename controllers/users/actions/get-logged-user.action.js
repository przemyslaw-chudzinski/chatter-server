const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class GetLoggedUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        if (!this.loggedUserId) throw new Error('id is required');
        try {
            const user = await UserModel.getById(this.loggedUserId);
            user ? this.simpleResponse(null, 200, user) : this.simpleResponse('User not found', 404);
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

}

module.exports = GetLoggedUserAction;
