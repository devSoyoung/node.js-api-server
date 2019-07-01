const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});

// 새로운 유저 생성
User.statics.create = function(username, password) {
  const user = new this({
    username,
    password,
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
  return this.password === password;
};

// 유저를 관리자 계정으로 설정
User.methods.assignAdmin = function() {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model('User', User);