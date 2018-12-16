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

    action() {
        UserModel.getByEmail(this.req.body.email).then(user => {
            if (!user) return this.simpleResponse( 'Wrong email or password', 404);
            if (this._passwordEncryption.verify(this.req.body.password, user.password)) {
                this.res.status(200);
                return this.jwt.sign({
                    user
                }).then(token => {
                    this.res.status(200);
                    this.res.json({
                        message: 'You have sign in correctly',
                        user,
                        token
                    });
                }).catch(err => this.simpleResponse('Internal server error 1', 500, err));
            }
            this.simpleResponse('Wrong email or password', 404);
        }).catch(err => this.simpleResponse('Internal server error 2', 500, err));
    }
}

module.exports = SignInAction;