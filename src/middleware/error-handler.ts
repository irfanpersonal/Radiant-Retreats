import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

interface ICustomError {
    statusCode: number,
    message: string
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let customError: ICustomError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, try again later!'
    };
    // ValidationError 
    if (err.name === 'SequelizeValidationError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        const uniquePathsSet = new Set(err.errors.map((value: any) => value.path));
        const uniquePaths = [...uniquePathsSet];
        const allPaths = uniquePaths.map((value, index) => {
            const separator = index === uniquePaths.length - 1 ? '' : (index === uniquePaths.length - 2 ? ', and ' : ', ');
            return `${value}${separator}`;
        }).join('');
        customError.message = `Please provide input for ${allPaths}`;
    }    
    // Duplicate Values Entered
    if (err.name === 'SequelizeUniqueConstraintError') {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        const uniquePathsSet = new Set(err.errors.map((value: any) => value.path));
        const uniquePaths = [...uniquePathsSet];
        const allPaths = uniquePaths.map((value, index) => {
            const separator = index === uniquePaths.length - 1 ? '' : (index === uniquePaths.length - 2 ? ', and ' : ', ');
            return `${value}${separator}`;
        }).join('');
        customError.message = `Someone already took the value entered for ${allPaths}`;
    }
    return res.status(customError.statusCode).json({msg: customError.message});
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
}

export default errorHandler;