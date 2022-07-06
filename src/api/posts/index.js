import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write); //미들웨어 posts 라우터에서 사용
posts.get('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.read);
posts.delete('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.remove);
posts.patch('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.update);
export default posts;