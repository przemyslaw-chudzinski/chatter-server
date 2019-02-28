const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class UpdateUserAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    async action() {
        const {avatar, _id} = this.req.body;
        if (!_id) throw new Error('payload data is incorrect');
        if (this.loggedUserId !== _id)  throw new Error('You don"t have permission for this action');

        try {
            let userModel = await UserModel.getById(this.loggedUserId);
            UpdateUserAction._validateAvatar(avatar, async (err, avt) => {
                if (err) return this.simpleResponse("Uploaded file must be an image", 409);
                userModel = UpdateUserAction._prepareData(userModel,this.req.body, avt);
                UpdateUserAction._updateUser(userModel)
                    .then(user => this.simpleResponse('User has been updated', 200, user))
                    .catch(() => this.simpleResponse('Internal server error', 500));
            });
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

    static _prepareData(userModel, {firstName, lastName, email}, avt) {
        firstName ? userModel.firstName = firstName : null;
        lastName ? userModel.lastName = lastName : null;
        email ? userModel.email = email : null;
        avt ?  userModel.avatar = avt : null;
        if (avt === 'remove') userModel.avatar = null;
        return userModel;
    }

    static _validateAvatar(avatar, next) {
        next = next || function () {};
        if (avatar && avatar.mimeType && avatar.mimeType.includes('image')) return next(false, avatar);
        else if (avatar && avatar === 'remove') return next(false, avatar);
        else if (!avatar) return next(false, null);
        return next(true, avatar);
    }

    static async _updateUser(userModel) {
        try {
            return await userModel.update();
        } catch (e) {
            return 'error';
        }
    }

}

module.exports = UpdateUserAction;
