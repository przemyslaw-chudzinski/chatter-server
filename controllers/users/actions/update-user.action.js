const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class UpdateUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {

        const payload = this.req.body;

        if (!payload._id) {
            throw new Error('payload data is incorrect');
        }

        if (this.loggedUserId !== payload._id) {
            throw new Error('You don"t have permission for this action');
        }

        UserModel.getById(this.loggedUserId)
            .then(user => {
                this._validateAvatar(payload.avatar, (err, avatar) => {

                    if (err) {
                        return this.simpleResponse("Uploaded file must be an image", 409, null);
                    }

                    payload.firstName ? user.firstName = payload.firstName : null;
                    payload.lastName ? user.lastName = payload.lastName : null;
                    payload.email ? user.email = payload.email : null;
                    avatar ? user.avatar = avatar : null;

                    user.update()
                        .then(user => {
                            this.res.status(200);
                            this.res.json(user);
                        })
                        .catch(err => this.simpleResponse(500, 'Something went wrong', err));
                });
            })
            .catch(err => this.simpleResponse(500, 'Something went wrong', err));
    }

    _validateAvatar(avatar, next) {
        next = next || function () {};
        if (avatar && avatar.mimeType && avatar.mimeType.includes('image')) {
            return next(false, avatar);
        } else if (!avatar) {
            return next(false, avatar);
        }
        return next(true, avatar);
    }

}

module.exports = UpdateUserAction;