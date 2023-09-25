import bodyParser = require('body-parser');
import {NextFunction, Request, Response} from 'express';
import productRouter from './router/product.route';
import orderRouter from './router/order.route';
import loginRouter from './router/login.route';
import commandRouter from './router/command.route';
import commandOrderRouter from './router/commandOrder.route';
import categoryRouter from './router/category.route';
import userRouter from './router/user.route';
import errorMiddleware from './Middlewares/error.middleware';

const express = require('express');
const app = express();
require('dotenv-safe').config();

app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,authorization',
  );
  next();
});

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/commands', commandRouter);
app.use('/login', loginRouter);
app.use('/command-orders', commandOrderRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);

app.use(errorMiddleware);

app.listen(8080);
console.log('listening on port: 8080');

export default app;
