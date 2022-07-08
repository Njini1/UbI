import Joi from 'joi';
import User from '../../models/user';

/*
  POST /api/auth/register
  {
    username: 'velopert',
    password: 'mypass123'
  }
*/
export const register = async ctx => {
  const schema =  Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    //유저 이미 존재하는지 확인 // findByUsername 스태틱 메서드 사용
    const exists = await User.findByUsername(username);
    if(exists) {
      ctx.status = 400;
      return;
    }

    const user = new User({
      username,
    });
    await user.setPassword(password); //비번 설정 // setPassword 인스턴스 함수 사용
    await user.save(); //db저장

    //응답할 데이터에서 hashedPassword 필드 제거
    //hashedPassword 필드가 응답되지 않도록 데이터를 JSON으로 변환한 후 delete
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000*60*60*24*7, //7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
/*
  POST /api/auth/login
  {
    username: 'velopert',
    password: 'mypass123'
  }
*/
export const login = async ctx => {
  const { username, password } = ctx.request.body;

  if(!username || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if(!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if(!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000*60*60*24*7, //7일
      httpOnly: true,
    });
  } catch(e) {
    ctx.throw(500, e);
  }
};
//로그인 상태 확인 GET /api/auth/check
export const check = async (ctx) => {
  const { user } = ctx.state;
  console.log(user);
  if (!user) {
    // 로그인중 아님
    ctx.status = 401; // Unauthorized
    return;
  }
  ctx.body = user;
};
//Post /api/auth/logout
export const logout = async ctx => {
  ctx.cookies.set('access_token');
  ctx.status = 204; //No content
};