import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';


import { authenticationRouter } from './routers/authentication.router';
import { cleanersRouter } from './routers/cleaners.router';
import { ordersRouter } from './routers/orders.router';
import { applicationConfig } from './configs/application.config';
import { connect } from './controllers/MongoDB.controller';
import { databaseErorHandler } from './events/mongoDB.event';
import { checkJWTMiddleware } from './middlewares/checkJWT.middleware';

const app = express();
const PORT = applicationConfig.port;
const HOST = applicationConfig.host;


// pug setup
app.set('views', path.join(process.cwd(), 'dist', 'views'));
app.set('view engine', 'pug');

// static setup
app.use(express.static('public'));

// middlewares setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkJWTMiddleware);

// // routers setup
app.use(authenticationRouter);
app.use(cleanersRouter);
app.use(ordersRouter);

// event handler
app.on('close', () => {
  mongoose.connection.close();
});

app.listen(PORT, HOST, async () => {
  console.log(`server is running on port: ${PORT}, host: ${HOST}`);
  const connection = await connect();
  connection.on('error', databaseErorHandler);
})

