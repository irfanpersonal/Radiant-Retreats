import CustomError from './custom-error';
import {StatusCodes} from 'http-status-codes';

class UnauthorizedError extends CustomError {
    statusCode: number = StatusCodes.UNAUTHORIZED;
    constructor(message: string) {
        super(message);
    }
}

export default UnauthorizedError;