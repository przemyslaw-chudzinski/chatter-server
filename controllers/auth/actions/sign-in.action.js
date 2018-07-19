const PasswordEncryption = require('../../../core/password-encryption/password-encryption');
const PasswordEncryptionBaseStrategy = require('../../../core/password-encryption/password-encryption-base-strategy');
const ActionBase = require('../../action-base');
const UsersModel = require('../../../db/models/users.model');
const Jwt = require('../../../core/jwt/jwt');

class SignInAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);
        this._jwt = new Jwt;
        this._userModel = new UsersModel;
        this._init();
    }

    _init() {
        // database.dbDriver.openConncetion(this._req, this._res, (client, db) => this._openConnectionCallback(client, db));
        this._userModel.getUserByEmail(this._req.body.email).then(data => {
            if (data.results_number === 0) {
                return this.simpleResponse(404, 'Wrong email or password');
            }
            if (this._passwordEncryption.verify(this._req.body.password, data.password)) {
                this._res.status(200);
                return this._jwt.sign({
                    user: data
                }).then(token => {
                    this._res.status(200);
                    this._res.json({
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