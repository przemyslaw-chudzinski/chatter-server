const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/user.model');

class GetUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const {params} = this.req;
            const user = await UsersModel.getById(params.id);
            user && this.simpleResponse(null, 200, user);
            return user;
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

}

module.exports = GetUserAction;
