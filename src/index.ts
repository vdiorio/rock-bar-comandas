import bodyParser = require('body-parser');
import {NextFunction, Request, Response} from 'express';

const express = require('express');
const app = express();
require('dotenv').config();
const {PORT} = process.env;

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

app.listen(PORT);
console.log(`listening on port: ${PORT}`);

export default app;
