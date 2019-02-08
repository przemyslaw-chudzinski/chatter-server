const PasswordEncryption = require('../../../core/password-encryption/index');
const PasswordEncryptionBaseStrategy = require('../../../core/password-encryption/password-encryption-base-strategy');
const ActionBase = require('../../action-base');
const UserModel = require('../../../db/models/user.model');

class SignInAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);
    }

    validationRules(validator) {
        return {
            email: validator.string().required(),
            password: validator.string().required()
        };
    }

    async action() {
        const {email, password} = this.req.body;
        let user = null;

        try {
            user = await UserModel.getByEmail(email);
        } catch (e) {
            return this.simpleResponse('Wrong email or password', 404);
        }

        if (!user) return this.simpleResponse( 'Wrong email or password', 404);
        if (this._passwordEncryption.verify(password, user.password)) {
            const token = await this.jwt.sign({user});
            this.res.status(200);
            this.res.json({
                message: 'You have signed in correctly',
                user,
                token
            });
        }
        this.simpleResponse('Wrong email or password', 404);
    }
}

module.exports = SignInAction;
