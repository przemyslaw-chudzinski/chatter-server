const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class CheckEmailAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        UserModel.getByEmail(this.req.body.email.toLowerCase())
            .then(user => {
                if (user && user.email === this.loggedUserEmail) return this.res.json(null);
                else if (!user) return this.res.json(null);
                else return this.res.json({isTaken: true});
            })
            .catch(err => this.simpleResponse(500, 'Internal server error', err))
    }
}

module.exports = CheckEmailAction;