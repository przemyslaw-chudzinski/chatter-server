const Jwt = require('../../core/jwt/jwt');
const database = require('../../db/db');

class ModelBase {
    constructor(req, res) {
        this._req = req;
        this._res = res;
        this._jwt = new Jwt;
    }

    get userId() {
        const token = this._req.headers.authorization.split(' ')[1];
        const decodedToken = this._jwt.decode(token);
        return database.dbDriver.ObjectId(decodedToken.user._id) || null;
    }
}

module.exports = ModelBase;