require('dotenv').config();
require('express-async-errors');
const reviewRouter = require('./routers/review.js');
const reservationRouter = require('./routers/reservation.js');
const listingRouter = require('./routers/listing.js');
const userRouter = require('./routers/user.js');
const authRouter = require('./routers/auth.js');
const {connectDB} = require('./database/connect.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');
const notFoundMiddleware = require('./middleware/not-found.js');
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('node:path');
const {StatusCodes} = require('http-status-codes');

app.use(cookieParser(process.env.JWT_SECRET));

app.use(fileUpload());

app.use(express.static('./images'));

app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/listings', listingRouter);

app.use('/api/v1/reservations', reservationRouter);

app.use('/api/v1/reviews', reviewRouter);

app.get('*', (req, res) => {
	return res.status(StatusCodes.OK).sendFile(path.resolve(__dirname, './client/build/index.html'));
});

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
const start = async() => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    }
    catch(error) {
        console.log(error);
    }
}

start();