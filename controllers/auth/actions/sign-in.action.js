const database = require('../../../db/db');
const PasswordEncryption = require('../../../core/password-encryption/password-encryption');
const PasswordEncryptionBaseStrategy = require('../../../core/password-encryption/password-encryption-base-strategy');
const ActionBase = require('../../action-base');
const collections = require('../../../db/collections/collections');
const Jwt = require('../../../core/jwt/jwt');

class SignInAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);
        this._jwt = new Jwt;
        this._init();
    }

    _init() {
        database.dbDriver.openConncetion(this._req, this._res, (client, db) => this._openConnectionCallback(client, db));
    }

    _openConnectionCallback(client, db) {
        return this._checkEmail(client, db).then(this._checkEmailResolveCallback.bind(this, db), this._credentialRejectCallback.bind(this));
    }

    _checkEmail(client, db) {
        return new Promise((resolve, reject) => {
            db.collection(collections.USERS).find({
                email: this._req.body.email
            }).toArray((err, results) => {
                client.close();
                if (err) {
                    return this.internalServerErrorHandler(err);
                }
                if (results && results.length && results.length === 1) {
                    return resolve(results[0]);
                }
                return reject();
            });
        });
    }

    _checkEmailResolveCallback(db, user) {
        return this._checkPassword(db, user).then(this._checkPasswordResolveCallback.bind(this, user), this._credentialRejectCallback.bind(this));
    }

    _checkPassword(db, user) {
        return new Promise((resolve, reject) => {
            return this._passwordEncryption.verify(this._req.body.password, user.password) ? resolve(true) : reject();
        });

    }

    _checkPasswordResolveCallback(user, correctPassword) {
        return this._createToken(user).then(this._createTokenResolveCallback.bind(this, user), this.internalServerErrorHandler.bind(this));
    }

    _credentialRejectCallback(reason) {
        return this.simpleErrorHandler(400, 'Invalid email or password');
    }

    _createToken(user) {
        delete user.password;
        return new Promise((resolve, reject) => {
            this._jwt.sign({
                user
            }).then(resolve, reject);
        });
    }

    _createTokenResolveCallback(user, token) {
        this._res.status(200);
        return this._res.json({
            error: false,
            message: 'You have sign in correctly',
            user,
            token: token
        });
    }
}

module.exports = SignInAction;