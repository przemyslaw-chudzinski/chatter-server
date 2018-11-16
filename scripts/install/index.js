const PasswordEncryption = require('../../core/password-encryption/index');
const PasswordEncryptionBaseStrategy = require('../../core/password-encryption/password-encryption-base-strategy');

const passwordEncryption = new PasswordEncryption(PasswordEncryptionBaseStrategy);

const password = passwordEncryption.encode('123456');

console.log(password);