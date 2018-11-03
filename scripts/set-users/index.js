const db = require('../../db');
const PasswordEncryption = require('../../core/password-encryption/index');
const PasswordEncryptionBaseStrategy = require('../../core/password-encryption/password-encryption-base-strategy');
const collections = require('../../db/collections/index');

const passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);

const password = passwordEncryption.encode('123456');

const insertData = (db, collection, body) => {
    db.collection(collection).insertMany(body, (err, data) => {
        if (err) {
            throw new Error('error while inserting user', body);
        }
    });
};

db.dbDriver.openConnection((err, client, db) => {
    const users = [
        {
            firstName: 'Przemysław',
            lastName: 'Chudziński',
            email: 'przemyslaw-chudzinski@wp.pl',
            password: password,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: null
        },
        {
            firstName: 'Anna',
            lastName: 'Kowalska',
            email: 'anna.kowalska@example.com',
            password: password,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: null
        },
        {
            firstName: 'Karloina',
            lastName: 'Nowak',
            email: 'karolina.nowak@example.com',
            password: password,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: 'http://placehold.it/100x100'
        },
        {
            firstName: 'Barbara',
            lastName: 'Doe',
            email: 'barbara.doe@example.com',
            password: password,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: null
        },
        {
            firstName: 'Katarzyna',
            lastName: 'Mega',
            email: 'katarzyna.mega@example.com',
            password: password,
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: null
        }
    ];
    insertData(db, collections.USERS, users);
    client.close();
    process.exit();
});