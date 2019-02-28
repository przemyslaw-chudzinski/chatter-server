const Jwt = require('../core/jwt');
const wsServer = require('../core/ws-server');
const fileSystem = require('../core/file-system');
const Joi = require('joi');

class ActionBase {
    constructor(req, res) {
        /**
         * @desc It gets request object
         */
        this._req = req;
        /**
         * @desc It gets response object
         */
        this._res = res;
        /**
         * @desc It gets jwt object
         * @type {Jwt}
         * @private
         */
        this._jwt = new Jwt;
        /**
         * @desc It gets file system object
         * @type {FileSystem}
         * @private
         */
        this._filesSystem = new fileSystem.FileSystem(req, res);
        /**
         * @desc It checks if user logged
         * @type {boolean}
         */
        this.auth = false;
    }

    /**
     * @desc It initializes route
     * @returns {*|Promise<any>}
     */
    init() {
        if (this.auth) {
            if (!this.loggedUserId) return this.simpleResponse('You don"t have access to this resource', 403, true);
        }
        const error = this.validationRules(Joi) ? this._validate() : null;
        error ? this.simpleResponse(error.details[0].message, 409, error) : this.action();
    }

    /**
     * @desc It handle route action
     */
    action() {

    }

    /**
     * @desc It returns validation rules
     * @param validator
     * @returns {{}}
     */
    validationRules(validator) {
        return null;
    }

    /**
     * @desc It validates input data
     * @returns {*}
     * @private
     */
    _validate() {
        const result = Joi.validate(this._req.body, this.validationRules(Joi));
        return result.error;
    }

    /**
     * @desc
     * @param status
     * @param message
     * @param data
     * @returns {*|Promise<any>}
     */
    simpleResponse(message = '', status = 400, data = null) {
        this._res.status(status);
        return this._res.json({
            message,
            data
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
        return this.loggedUser ? this.loggedUser._id : null;
    }

    /**
     * @desc
     * @returns {string|*}
     * @todo still working
     */
    get loggedUser() {
        return this.decodedToken ? this.decodedToken.user : null;
    }

    /**
     * @desc It returns logged user email
     * @returns {string}
     */
    get loggedUserEmail() {
        return this.loggedUser.email;
    }

    /**
     * @desc It returns decoded token
     * @returns {*|void}
     */
    get decodedToken() {
        return this._req.headers.authorization ? this._jwt.decode(this._req.headers.authorization.split(' ')[1]) : null;
    }

    /**
     * @desc It returns the instance of websocket server
     * @returns {null}
     */
    get wsServer() {
        return wsServer.getInstance();
    }

    /**
     * @desc It returns the instance of FileSystem (not file system built in node js)
     * @returns {FileSystem}
     */
    get filesSystem() {
        return this._filesSystem;
    }
}

module.exports = ActionBase;
