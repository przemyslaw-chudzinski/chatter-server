const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');

class UpdateUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._userModel = new UsersModel(req, res);
        this._init();
    }

    _init() {
        if (!this.loggedUserId) {
            throw new Error('user is not logged');
        }
        if (!this.req.body._id) {
            throw new Error('payload data is incorrect');
        }

        if (this.loggedUserId !== this.req.body._id) {
            throw new Error('You dont have permission for this action');
        }

        this._userModel.updateUser(this.req.body)
            .then(updatedUser => {
                this.res.status(200);
                this.res.json(updatedUser);
            })
            .catch(err => this.simpleResponse(500, 'Something went wrong', err))
    }

}

module.exports = UpdateUserAction;