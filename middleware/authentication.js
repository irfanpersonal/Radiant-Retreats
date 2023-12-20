const CustomError = require('../errors');
const {verifyToken} = require('../utils');

const authentication = (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        if (!token) {
            throw new CustomError.UnauthorizedError('Missing/Invalid Bearer Token');
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(error) {
        throw new CustomError.UnauthorizedError('Failed to Authenticate User!');
    }
}

const restrictFunctionalityTo = (...roles) => {
    return async(req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.ForbiddenError('Access Forbidden');
        }
        next();
    }
}  

module.exports = {
    authentication,
    restrictFunctionalityTo
};