const formIdable = require('formidable');
const async = require('async');
const File = require('./file');

const IncomingForm = formIdable.IncomingForm;

class FileSystem {
    constructor(req, res) {
        this._req = req;
        this._res = res;
        this._form = new IncomingForm();
    }

    upload() {
        return new Promise((resolve, reject) => this._parse()
            .then(files => {
                this._saveFiles(files)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err)));
    }

    _parse() {
        return new Promise((resolve, reject) =>  this._form.parse(this._req, (err, fields, files) => err ? reject(err) : resolve(files)));
    }

    _saveFiles(files) {
        return new Promise((resolve, reject) => {
            const savedFiles = [];
            async.each(files, (file, next) => {
                const _file = new File(file);
                _file
                    .save()
                    .then(f => {
                        savedFiles.push(f);
                        next();
                    })
                    .catch(err => next(err));
            }, err => err ? reject(err) : resolve(savedFiles));
        });
    }
}

module.exports = FileSystem;