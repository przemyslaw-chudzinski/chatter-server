const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

const _prepareData = Symbol();
const _validateAvatar = Symbol();
const _updateUser = Symbol();
const _avatarValidatorHandler = Symbol();

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
            const userModel = await UserModel.getById(this.loggedUserId);
            this[_validateAvatar](avatar, this[_avatarValidatorHandler].bind(this, userModel));
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
        }
    }

    /**
     * @param userModel
     * @param err
     * @param avatar
     * @returns {Promise<*|Promise<any>>}
     */
    async [_avatarValidatorHandler](userModel, err, avatar) {
        if (err) return this.simpleResponse("Uploaded file must be an image", 409);
        userModel = this[_prepareData](userModel,this.req.body, avatar);
        try {
            const user = await this[_updateUser](userModel);
            this.simpleResponse('User has been updated', 200, user);
            return user;
        } catch (e) {
            this.simpleResponse('Internal server error', 500);
            throw new Error('Something went wrong inside avatar validator');
        }
    }

    /**
     * @param userModel
     * @param firstName
     * @param lastName
     * @param email
     * @param avt
     * @returns {*}
     */
    [_prepareData](userModel, {firstName, lastName, email}, avt) {
        firstName ? userModel.firstName = firstName : null;
        lastName ? userModel.lastName = lastName : null;
        email ? userModel.email = email : null;
        avt ?  userModel.avatar = avt : null;
        if (avt === 'remove') userModel.avatar = null;
        return userModel;
    }

    /**
     * @param avatar
     * @param next
     * @returns {*}
     */
    [_validateAvatar](avatar, next) {
        next = next || function () {};
        if (avatar && avatar.mimeType && avatar.mimeType.includes('image')) return next(false, avatar);
        else if (avatar && avatar === 'remove') return next(false, avatar);
        else if (!avatar) return next(false, null);
        return next(true, avatar);
    }

    /**
     * @param userModel
     * @returns {Promise<*>}
     */
    async [_updateUser](userModel) {
        try {
            return await userModel.update();
        } catch (e) {
            throw new Error('Cannot update user');
        }
    }

}

module.exports = UpdateUserAction;
