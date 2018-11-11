const ActionBase = require('../../action-base');

class UploadFilesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        this.filesSystem.upload()
            .then(files => {
                this.res.json(files);
            })
            .catch();
    }
}

module.exports = UploadFilesAction;