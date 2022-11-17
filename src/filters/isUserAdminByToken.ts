import constants from "../constants";

let jwt = require('jsonwebtoken');

let replaceBearer = async (token) => {
    return await token.replace('Bearer ', '');
};
let getCompaignIdFromAdminToken = async (token) => {
    let _token = await replaceBearer(token);
    return await jwtVerify(_token);
};

let jwtVerify = async (token) => {
    return await verify(token);
};

async function verify(token) {
    return await jwtVerifyCallback(token);
}

async function jwtVerifyCallback(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, constants.JWT_KEY, (err, decoded) => {
            if (err) return reject(err);
            return resolve(decoded);
        });
    });
}

export {getCompaignIdFromAdminToken};