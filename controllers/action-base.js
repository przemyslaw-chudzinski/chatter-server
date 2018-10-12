const Jwt = require('../core/jwt');
const wsServer = require('../core/ws-server');

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

    /**
     * @desc It returns request object
     * @returns {*}
     */
    get req() {
        return this._req;
    }

    /**
     * @desc It returns response object
     * @returns {*}
     */
    get res() {
        return this._res;
    }

    /**
     * @desc It returns the JWT instance
     * @returns {Jwt}
     */
    get jwt() {
        return this._jwt;
    }

    /**
     * @desc It returns logged user _id
     * @returns {*}
     */
    get loggedUserId() {
        return this.loggedUser._id;
    }

    /**
     * @desc
     * @returns {string|*}
     * @todo still working
     */
    get loggedUser() {
        return this.decodedToken.user;
    }

    /**
     * @desc It returns logged user email
     * @returns {string}
     */
    get loggeduserEmail() {
        return this.loggedUser.email;
    }

    /**
     * @desc It returns decoded token
     * @returns {*|void}
     */
    get decodedToken() {
        const token = this._req.headers.authorization.split(' ')[1];
        return this._jwt.decode(token);
    }

    /**
     * @desc It returns the instance of websocket server
     * @returns {null}
     */
    get wsServer() {
        return wsServer.getInstance();
    }
}

module.exports = ActionBase;