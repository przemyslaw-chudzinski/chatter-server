const ActionBase = require('../../action-base');

class UploadFilesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this._init();
    }

    _init() {
        this.filesSystem.upload()
            .then(files => {
                this.res.json(files);
            })
            .catch();
    }
}

module.exports = UploadFilesAction;