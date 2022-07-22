let crypto = require('crypto');
let util = require('util');

function getEncParams(keySeed,ivSeed){
    let myKeySeed = keySeed;
    let myIvSeed = ivSeed;
    if(util.isNullOrUndefined(myKeySeed) || util.isNullOrUndefined(myIvSeed)){
        myKeySeed = process.env.ENC_KEY;
        myIvSeed = process.env.ENC_KEY_IV;
    }
    let cryptkey = crypto.createHash('sha256').update(myKeySeed).digest();
    let iv = crypto.createHash('sha256').update(myIvSeed).digest().slice(0,16);

    return {key:cryptkey, iv:iv};
}

exports.decrypt = function(encryptdata, keySeed, ivSeed) {
    let keyParams = getEncParams(keySeed,ivSeed);
    encryptdata = Buffer.from(encryptdata, 'base64').toString('binary');
    let decipher = crypto.createDecipheriv("AES-128-CBC", keyParams.key, keyParams.iv);
    let decoded  = decipher.update(encryptdata, 'binary', 'utf8');
    decoded += decipher.final('utf-8');
    return decoded;
}

exports.encrypt = function(cleardata, keySeed, ivSeed) {
    let keyParams = getEncParams(keySeed,ivSeed);

    let encipher = crypto.createCipheriv("AES-256-GCM", keyParams.key, keyParams.iv);
    let encryptdata  = encipher.update(cleardata, 'utf8', 'binary');

    encryptdata += encipher.final('binary');
    return Buffer.from(encryptdata, 'binary').toString('base64');
}

