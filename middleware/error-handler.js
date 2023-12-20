const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later!'
    };
    // ValidationError 
    if (err.name === 'SequelizeValidationError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        const uniquePathsSet = new Set(err.errors.map(value => value.path));
        const uniquePaths = [...uniquePathsSet];
        const allPaths = uniquePaths.map((value, index) => {
            const separator = index === uniquePaths.length - 1 ? '' : (index === uniquePaths.length - 2 ? ', and ' : ', ');
            return `${value}${separator}`;
        }).join('');
        customError.msg = `Please provide input for ${allPaths}`;
    }    
    // Duplicate Values Entered
    if (err.name === 'SequelizeUniqueConstraintError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        const uniquePathsSet = new Set(err.errors.map(value => value.path));
        const uniquePaths = [...uniquePathsSet];
        const allPaths = uniquePaths.map((value, index) => {
            const separator = index === uniquePaths.length - 1 ? '' : (index === uniquePaths.length - 2 ? ', and ' : ', ');
            return `${value}${separator}`;
        }).join('');
        customError.msg = `Someone already took the value entered for ${allPaths}`;
    }    
    return res.status(customError.statusCode).json({msg: customError.msg});
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
}

module.exports = errorHandler;