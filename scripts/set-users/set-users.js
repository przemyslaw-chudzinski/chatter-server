const db = require('../../db/db');
const PasswordEncryption = require('../../core/password-encryption/password-encryption');
const PasswordEncryptionBaseStrategy = require('../../core/password-encryption/password-encryption-base-strategy');
const collections = require('../../db/collections/collections');

const passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);

const password = passwordEncryption.encode('123456');

const insertData = (db, collection, body) => {
    db.collection(collection).insertMany(body, (err, data) => {
        if (err) {
            throw new Error('error while inserting user', body);
        }
    });
}

db.dbDriver.openConncetion(null, null, (client, db) => {
    const users = [{
        firstName: 'Przemysław',
        lastName: 'Chudziński',
        email: 'przemyslaw-chudzinski@wp.pl',
        password: password,
        confirmed: true,
        createdAt: '',
        updatedAt: '',
        avatar: 'http://placehold.it/100x100'
    }, {
        firstName: 'Anna',
        lastName: 'Kowalska',
        email: 'anna.kowalska@example.com',
        password: password,
        confirmed: true,
        createdAt: '',
        updatedAt: '',
        avatar: 'http://placehold.it/100x100'
    }, {
        firstName: 'Karloina',
        lastName: 'Nowak',
        email: 'karolina.nowak@example.com',
        password: password,
        confirmed: true,
        createdAt: '',
        updatedAt: '',
        avatar: 'http://placehold.it/100x100'
    }];
    insertData(db, collections.USERS, users);
    client.close();
    process.exit();
});