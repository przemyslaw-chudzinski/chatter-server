const Jwt = require('../core/jwt');

class ActionBase {
    constructor(req, res) {
        this._req = req;
        this._res = res;
        this._jwt = new Jwt;
    }

    simpleResponse(status = 400, message = '', err = null) {
        this._res.status(status);
        return this._res.json({
            message,
            error: err
        });
    }

    get loggedUserId() {
        return this.decodedToken.user._id;
    }

    get decodedToken() {
        const token = this._req.headers.authorization.split(' ')[1];
        return this._jwt.decode(token);
    }
}

module.exports = ActionBase;