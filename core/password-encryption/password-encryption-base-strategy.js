const PasswordEncryptionStrategy = require('./password-encryption-strategy');
const passwordHash = require('password-hash');

class PasswordEncryptionBaseStrategy extends PasswordEncryptionStrategy {
    encode(password) {
        if (typeof password !== 'string') throw new Error('password must be type of string');
        return passwordHash.generate(password);
    }

    verify(password, hashedPassword) {
        if (typeof password !== 'string') throw new Error('password must be type of string');
        if (typeof hashedPassword !== 'string') throw new Error('password must be type of string');
        if (!passwordHash.isHashed(hashedPassword)) throw new Error('hashedPassword must be hashed');
        return passwordHash.verify(password, hashedPassword);
    }
}

module.exports = PasswordEncryptionBaseStrategy;