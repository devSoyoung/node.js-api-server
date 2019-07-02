// 필요한 라이브러리 로드
const Koa = require('koa');

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

// 설정 로드
const config = require('./config');
const port = process.env.PORT || 3000;

const app = new Koa();
const router = require('./src/routes');

// Use logger, body parser middleware
app.use(logger());
app.use(bodyParser());

// Router 미들웨어 적용
app.use(router.routes());
app.use(router.allowedMethods());

// PORT 오픈
const server = app.listen(port, () => {
  console.log(`express is running on port ${port}`);
});

// mongoDB 와 연결 설정
mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('connected to mongodb server');
});

module.exports = server;