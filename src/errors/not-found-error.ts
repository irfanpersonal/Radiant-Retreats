import CustomError from './custom-error';
import {StatusCodes} from 'http-status-codes';

class NotFoundError extends CustomError {
    statusCode: number = StatusCodes.NOT_FOUND;
    constructor(message: string) {
        super(message);
    }
}

export default NotFoundError;