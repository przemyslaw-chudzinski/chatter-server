const ActionBase = require('../../action-base');

class UploadFilesAction extends ActionBase {
    constructor(req, res) {
        super(req, res);
        this.auth = true;
    }

    action() {
        this.filesSystem.upload()
            .then(files =>  this.res.json(files))
            .catch(err => this.simpleResponse('Something went wrong with upload files', 500, err));
    }
}

module.exports = UploadFilesAction;