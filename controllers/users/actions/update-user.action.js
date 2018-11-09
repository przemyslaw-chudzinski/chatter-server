const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class UpdateUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {

        const payload = this.req.body;

        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
            if (!payload._id) {
            throw new Error('payload data is incorrect');
        }

        if (this.loggedUserId !== payload._id) {
            throw new Error('You dont have permission for this action');
        }

        UserModel.getById(this.loggedUserId)
            .then(user => {
                payload.firstName ? user.firstName = payload.firstName : null;
                payload.lastName ? user.lastName = payload.lastName : null;
                payload.email ? user.email = payload.email : null;
                user.update()
                    .then(user => {
                        this.res.status(200);
                        this.res.json(user);
                    })
                    .catch(err => this.simpleResponse(500, 'Something went wrong', err));
            })
            .catch(err => this.simpleResponse(500, 'Something went wrong', err));
    }

}

module.exports = UpdateUserAction;