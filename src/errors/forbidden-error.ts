import CustomError from './custom-error';
import {StatusCodes} from 'http-status-codes';

class ForbiddenError extends CustomError {
    statusCode: number = StatusCodes.FORBIDDEN;
    constructor(message: string) {
        super(message);
    }
}

export default ForbiddenError;