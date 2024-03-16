"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, try again later!'
    };
    // ValidationError 
    if (err.name === 'SequelizeValidationError') {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        const uniquePathsSet = new Set(err.errors.map((value) => value.path));
        const uniquePaths = [...uniquePathsSet];
        const allPaths = uniquePaths.map((value, index) => {
            const separator = index === uniquePaths.length - 1 ? '' : (index === uniquePaths.length - 2 ? ', and ' : ', ');
            return `${value}${separator}`;
        }).join('');
        customError.message = `Please provide input for ${allPaths}`;
    }
    // Duplicate Values Entered
    if (err.name === 'SequelizeUniqueConstraintError') {
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        const uniquePathsSet = new Set(err.errors.map((value) => value.path));
        const uniquePaths = [...uniquePathsSet];
        const allPaths = uniquePaths.map((value, index) => {
            const separator = index === uniquePaths.length - 1 ? '' : (index === uniquePaths.length - 2 ? ', and ' : ', ');
            return `${value}${separator}`;
        }).join('');
        customError.message = `Someone already took the value entered for ${allPaths}`;
    }
    return res.status(customError.statusCode).json({ msg: customError.message });
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};
exports.default = errorHandler;
