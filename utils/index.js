const jwt = require('jsonwebtoken');
const CustomError = require('../errors');

const createJWT = (user) => {
    return jwt.sign(
        {userID: user.id, name: user.name, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

const attachCookieToResponse = (res, token) => {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    });
}

const checkIfAllowed = (requestUser, findID) => {
    if (requestUser.role === 'owner') {
        return;
    }
    if (String(requestUser.userID) === findID) {
        return;
    }
    throw new CustomError.ForbiddenError('Action Forbidden because of Role/FindID');
}

module.exports = {
    createJWT,
    verifyToken,
    attachCookieToResponse,
    checkIfAllowed
};