const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

class File {
    constructor(file) {
        this._file = file;
        this._fileId = uuid();
    }

    save() {
        return new Promise((resolve, reject) => {
            fs.rename(this._file.path, this.uploadPath, err => {
                if (err) {
                    return reject(err);
                }

                resolve(this);

            });
        });
    }

    get fileId() {
        return this._fileId;
    }

    get uploadPath() {
        return path.join(__dirname, '..', '..', 'public', 'upload', this.name);
    }

    get name() {
        return this._file.name;
    }

    get size() {
        return this._file.size;
    }

    get mimeType() {
        return this._file.type;
    }

    get extension() {
        return this.name.split('.')[1];
    }

    get url() {
        return 'http://localhost:3000/upload/'+ this.name;
    }

}

module.exports = File;