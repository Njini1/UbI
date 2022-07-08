import Router from 'koa-router';
import posts from './posts';
import auth from './auth';
import myPage from './myPage/index';
const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());
api.use('/myPage', myPage.routes());

export default api;