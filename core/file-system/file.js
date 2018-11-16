const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const gm = require('gm');

class File {
    constructor(file) {
        this._file = file;
        this._fileId = uuid();
        this._output = this.baseOutput
    }

    save() {
        return new Promise((resolve, reject) => {
            this._saveFile()
                .then(() => this.isImage && this._createThumbnail()
                    .then(() => {
                        resolve(this._output);
                    })
                    .catch(err => reject(err)) || resolve(this._output))
                .catch(err => reject(err));
        });
    }

    _saveFile() {
        return new Promise((resolve, reject) => {
            fs.rename(this._file.path, this.uploadPath(), err => {
                if (err) {
                    return reject(err);
                }

                this._output.original =  {
                    name: this.name,
                    size: this.size,
                    url: this.url()
                };

                resolve();
            });
        });
    }

    _createThumbnail() {
        return new Promise((resolve, reject) => {
            const thumbnailName = 'thumbnail-' + this.name;
            const thumbnailUploadPath = this.uploadPath(thumbnailName);

            gm(this.uploadPath())
                .resize(160,160)
                .write(thumbnailUploadPath, err => {
                    if (err) {
                        return reject(err);
                    }

                    this._output.thumbnail = {
                        name: thumbnailName,
                        size: null,
                        url: this.url(thumbnailName)
                    };

                    resolve();
                });
        });
    }

    get fileId() {
        return this._fileId;
    }

    uploadPath(name) {
        name = name || this.name;
        return path.join(__dirname, '..', '..', 'public', 'upload', name);
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
        const separatedName = this.name.split('.');
        return separatedName[separatedName.length - 1];
    }

    url(name) {
        name = name || this.name;
        return 'http://localhost:3000/upload/'+ name;
    }

    get baseOutput() {
        return {
            original: null,
            thumbnail: null,
            mimeType: this.mimeType,
            extension: this.extension,
            fileId: this.fileId
        };
    }

    get isImage() {
        return this.mimeType.includes("image");
    }

}

module.exports = File;