const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const config = require('../../config');

const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});

// create, verify 에서 재사용되므로 함수로 묶음
const getEncryptedPassword = password => {
  return crypto.createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");
};

// 새로운 유저 생성
User.statics.create = function(username, password) {
  const user = new this({
    username,
    password: getEncryptedPassword(password),
  });

  // return Promise
  return user.save();
};

// 이름으로 유저 검색
User.statics.findOneByUsername = function(username) {
  return this.findOne({
    username
  }).exec();
};

// 비밀번호 검증
// TODO: 현재는 true/false 반환, 나중에는 Hash 반환하도록 변경
User.methods.verify = function(password) {
  return this.password === getEncryptedPassword(password);
};

// 유저를 관리자 계정으로 정
User.methods.assignAdmin = function() {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model('User', User);