/* eslint-disable no-undef */
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 비밀번호를 파라미터로 받아서 계정의 hashedPassword로 설정
UserSchema.methods.setPassword = async function(password) { // 화살표 함수가 아닌 function사용해야함 -> 함수 내부에 this 접근해야하기 때문
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash
};

// 파라미터로 받은 비밀번호가 해당 계정의 비번과 일치하는지 검증
UserSchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

UserSchema.methods.serialize =  function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

// 토큰 발급
UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    //첫번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣음
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, //두번째 파라미터에는 JWT 암호를 넣음
    {
      expiresIn: '7d',
    },
  );
  return token;
}

const User = mongoose.model('User', UserSchema);
export default User;