const PasswordEncryptionStrategy = require('./password-encryption-strategy');

class Index {
    constructor(PasswordEncryptionStrategyClass) {
        this._strategy = new PasswordEncryptionStrategyClass;
        if (!(this._strategy instanceof PasswordEncryptionStrategy)) {
            throw new Error('encryptionStrategy must be instance of PasswordEncryptionStrategy');
        }
    }

    encode(password) {
        return this._strategy.encode(password);
    }

    verify(password, hashedPassword) {
        return this._strategy.verify(password, hashedPassword)
    }
}

module.exports = Index;