const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class UpdateUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        const {firstName, lastName, email, avatar, _id} = this.req.body;
        if (!_id) throw new Error('payload data is incorrect');
        if (this.loggedUserId !== _id)  throw new Error('You don"t have permission for this action');

        UserModel.getById(this.loggedUserId)
            .then(user => this._validateAvatar(avatar, (err, avt) => {
                if (err) return this.simpleResponse("Uploaded file must be an image", 409, null);

                firstName ? user.firstName = firstName : null;
                lastName ? user.lastName = lastName : null;
                email ? user.email = email : null;
                avt ? user.avatar = avt : null;

                user.update().then(user => {
                        this.res.status(200);
                        this.res.json(user);
                    }).catch(err => this.simpleResponse(500, 'Something went wrong', err));
            })).catch(err => this.simpleResponse(500, 'Something went wrong', err));
    }

    _validateAvatar(avatar, next) {
        next = next || function () {};
        if (avatar && avatar.mimeType && avatar.mimeType.includes('image')) return next(false, avatar);
        else if (!avatar) return next(false, null);
        return next(true, avatar);
    }

}

module.exports = UpdateUserAction;
