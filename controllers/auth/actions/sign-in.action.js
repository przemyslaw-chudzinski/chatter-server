const PasswordEncryption = require('../../../core/password-encryption/index');
const PasswordEncryptionBaseStrategy = require('../../../core/password-encryption/password-encryption-base-strategy');
const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/user.model');

class SignInAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);
        this._userModel = new UsersModel;
        this._init();
    }

    _init() {
        this._userModel.getUserByEmail(this.req.body.email).then(data => {
            if (!data) {
                return this.simpleResponse(404, 'Wrong email or password');
            }
            if (this._passwordEncryption.verify(this.req.body.password, data.password)) {
                this.res.status(200);
                return this.jwt.sign({
                    user: data
                }).then(token => {
                    this.res.status(200);
                    this.res.json({
                        message: 'You have sing in correctly',
                        user: data,
                        token
                    });
                }).catch(err => this.simpleResponse(500, 'Internal server error', err));
            }
            this.simpleResponse(404, 'Wrong email or password');
        }).catch(err => this.simpleResponse(500, 'Internal server error', err));
    }
}

module.exports = SignInAction;