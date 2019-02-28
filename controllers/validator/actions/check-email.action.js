const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class CheckEmailAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        try {
            const userModel = await UserModel.getByEmail(this.req.body.email.toLowerCase());
            if (!userModel.email || userModel.email === this.loggedUserEmail) return this.res.json(null);
            else return this.res.json({isTaken: true});
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }
}

module.exports = CheckEmailAction;
