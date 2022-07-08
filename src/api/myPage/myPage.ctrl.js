import Joi from '../../../node_modules/joi/lib/index';
import User from '../../models/user';

// export const getUserById = async ctx => {
//   const { id } = ctx.state.
// };


//update 전 개인정보를 먼저 보여줘야함 이걸 update안으로 넣든 자주쓸거 같으면 빼내든
export const update = async (ctx) => {
  const { user } = ctx.state;
  console.log(user._id);
  const schema = Joi.object().keys({
    username: Joi.string(),
    password: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const updateUser = await User.findByIdAndUpdate(user._id, ctx.request.body, {
      new: true,
    }).exec();
    if(!user) {
      ctx.status = 404;
      return;
    }
    ctx.body = updateUser;
  } catch (e) {
    ctx.throw(500, e);
  }
};