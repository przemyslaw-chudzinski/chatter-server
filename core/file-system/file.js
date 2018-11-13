const fs = require('fs');
const path = require('path');
// const sharp = require('sharp');
const uuid = require('uuid');
const easyimage = require('easyimage');

class File {
    constructor(file) {
        this._file = file;
        this._fileId = uuid();
        this._output = this.baseOutput
    }

    save() {
        return new Promise((resolve, reject) => {
            fs.rename(this._file.path, this.uploadPath, err => {
                if (err) {
                    return reject(err);
                }

                // sharp(this._file)
                //     .resize(160, 160)
                //     .toFile(this.uploadPath, (err, info) => {
                //         if (err) {
                //             throw new Error('sharp - preparing image failed')
                //         }
                //         resolve(this);
                //     });

                this._output.original =  {
                    name: this.name,
                    size: this.size,
                    url: this.url,
                };

                easyimage.thumbnail({
                    src: this.uploadPath,
                    width: 160,
                    height: 160
                });

                resolve(this._output);

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

    get baseOutput() {
        return {
            original: null,
            thumbnail: null,
            mimeType: this.mimeType,
            extension: this.extension,
            fileId: this.fileId
        };
    }

}

module.exports = File;