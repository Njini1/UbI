import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi'; //객체를 검증하기 위해 값을 if문 비교 대신라이브러리 사용

const { ObjectId } = mongoose.Types;

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  console.log(id);
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  try {
    const post = await Post.findById(id);
    if(!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
  return next();
};

export const write = async ctx => {
  const schema = Joi.object().keys({
    title: Joi.string().required(), // required() 가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
    // product: Joi.string().required(),
    // location: Joi.string().required(),
  });

  // 클라이언트가 값을 빼먹을 때 400오류
  const result = schema.validate(ctx.request.body); //문법 바뀜
  console.log(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { title,body, tags, product, location } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    product,
    location,
    writer: ctx.state.user
  });
  try {
    await post.save(); // save 함수를 실행시켜야 데이터베이스에 저장 // await로 저장 요청을 완료할 때까지 대기 // await를 사용할때는try catch문으로 오류 처리해야함
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};


export const list = async ctx => {
  const page = parseInt(ctx.query.page || '1', 10); //query는 문자열이기 때문에 숫자로 변환
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find().sort({_id: -1}).limit(10).skip((page-1)*10).exec(); // exec()를 붙여 주어야 서버에 쿼리 요청
    const postCount = await Post.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map((post) => post.toJSON()).map(post=>({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0,200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const read = async ctx => {
  console.log(ctx.state);
  ctx.body = ctx.state.post;
};
export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const update = async ctx => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    product: Joi.string(),
    location: Joi.string(),
  });

  const result = schema.validate(ctx.request.body); //문법 바뀜
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,//true이면 업데이트 된 데이터 반환 false 업데이트 되긴 전 데이터 반환
    }).exec();
    if(!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  console.log(ctx.state);
  if (post.writer._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};