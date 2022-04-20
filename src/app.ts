import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


import { authenticationRouter } from './routers/authentication.router';
import { cleanersRouter } from './routers/cleaners.router';
import { ordersRouter } from './routers/orders.router';
import { applicationConfig } from './configs/application.congfig';
import { MongoDBController } from './controllers/MongoDB.controller';

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

// routers setup
app.use(authenticationRouter);
app.use(cleanersRouter);
app.use(ordersRouter);

app.listen(PORT, HOST, async () => {
  console.log('server is ran');
  const databaseConnection = await MongoDBController.getInstance().connectToDB();
  if (databaseConnection) {
    console.log('database connected succesfully');
  }
})

