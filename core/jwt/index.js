const index = require('jsonwebtoken');

class Jwt {
    constructor() {
        this._config = {expiresIn: '10h'};
        this._init();
    }

    _init() {
        if (!process.env.JWT_SECRET_KEY || typeof process.env.JWT_SECRET_KEY !== 'string' || process.env.JWT_SECRET_KEY === '') {
            throw new Error('JWT_SECRET_KEY doesn\'t exist in env variable');
        }
    }

    sign(payload = {}) {
        return new Promise((resolve, reject) => {
            index.sign(payload, process.env.JWT_SECRET_KEY, this._config, (err, token) => this._signCallback(err, token, resolve, reject));
        });
    }

    _signCallback(err, token, resolve, reject) {
        return err ? reject(err) : resolve(token);
    }

    verify(token = '') {
        return new Promise((resolve, reject) => index.verify(token, process.env.JWT_SECRET_KEY, null, (err, decodedToken) => this._verifyCallback(err, decodedToken, resolve, reject)));
    }

    _verifyCallback(err, decodedToken, resolve, reject) {
        return err ? reject(err) : resolve(decodedToken);
    }

    isExpired() {}

    refresh() {}

    decode(token = '', callbackError) {
        callbackError = callbackError || function () {};
        try {
            return index.decode(token);
        } catch (e) {
            return callbackError(err);
        }
    }
}

module.exports = Jwt;