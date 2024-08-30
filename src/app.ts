import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app: express.Express = express();
import './database/connect';
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import authRouter from './routers/auth';
import userRouter from './routers/user';
import hostRequestRouter from './routers/hostRequest';
import listingRouter from './routers/listing';
import reservationRouter from './routers/reservation';
import adminRouter from './routers/admin';
import cashOutRouter from './routers/cashout';

import fileUpload from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import cookieParser from 'cookie-parser';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import path from 'node:path';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.use(fileUpload());

app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.json());

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/user', userRouter);

app.use('/api/v1/hostRequest', hostRequestRouter);

app.use('/api/v1/listing', listingRouter);

app.use('/api/v1/reservation', reservationRouter);

app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/cashout', cashOutRouter);

app.get('*', (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).sendFile(path.resolve(__dirname, './client/build/index.html'));
});

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port: number = Number(process.env.PORT) || 4000;
const start = async() => {
    try {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    }
    catch(error) {
        console.log(error);
    }
}

start();