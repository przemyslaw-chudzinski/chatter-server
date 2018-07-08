class ActionBase {
    constructor(req, res) {
        this._req = req;
        this._res = res;
    }
    internalServerErrorHandler(err, status = 500, message = 'Internal server error') {
        this._res.status(status);
        return this._res.json({
            message: message,
            error: err
        });
    }

    simpleErrorHandler(status = 400, message = '') {
        this._res.status(status);
        return this._res.json({
            message: message,
            error: true
        });
    }
}

module.exports = ActionBase;