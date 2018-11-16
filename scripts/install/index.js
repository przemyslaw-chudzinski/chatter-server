const db = require('../../db');
const collections = require('../../db/collections/index');
const PasswordEncryption = require('../../core/password-encryption/index');
const PasswordEncryptionBaseStrategy = require('../../core/password-encryption/password-encryption-base-strategy');

const passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);

const password = passwordEncryption.encode('123456');


db.dbDriver.openConnection((err, client, db) => {

    if (err) {
        return console.log('connection error');
    }

    db.collection(collections.USERS).insert({
        firstName: 'Przemysław',
        lastName: 'Chudziński',
        email: 'przemyslaw-chudzinski@wp.pl',
        password: password,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: null
    }, (err, doc) => {
        db.collection(collections.USERS).insert({
            firstName: 'Anna',
            lastName: 'Kowalska',
            email: 'anna.kowalska@example.com',
            password: password,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: null
        }, (err, doc) => {
            client.close();
            process.exit();
            console.log('done')
        });
    });

});