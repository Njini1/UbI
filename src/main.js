/* eslint-disable no-undef */
require('dotenv').config();

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import jwtMiddleware from './lib/jwtMiddleware'; 

const { PORT, MONGO_URI } = process.env;
const app = new Koa();
const router = new Router();

mongoose.connect(MONGO_URI).then(()=> {
  console.log('Connect to MongoDB');
}).catch(e => {
  console.log(e);
});

//라우터 설정
router.use('/api', api.routes());
app.use(bodyParser());
app.use(jwtMiddleware); //router보다 먼저 미들웨어 설정이 되어야함

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log('server start port %d', port);
})