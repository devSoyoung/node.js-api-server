// 필요한 라이브러리 로드
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// 설정 로드
const config = require('./config');
const port = process.env.PORT || 3000;

const app = express();

// bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// morgan middleware: for log
app.use(morgan('dev'));

// JWT 위한 secret key 설정
app.set('jwt-secret', config.secret);

app.get('/', (req, res) => {
  res.send('Hello JWT');
});

app.listen(port, () => {
  console.log(`express is running on port ${port}`);
});

app.use('/api', require('./src/routes/api'));

// mongoDB 와 연결 설정
mongoose.connect(config.mongodbUri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('connected to mongodb server');
});