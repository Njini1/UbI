import Router from 'koa-router';
import checkLoggedIn from '../../lib/checkLoggedIn';
import * as myPageCtrl from './myPage.ctrl';


const myPage =  new Router();

myPage.patch('/update', checkLoggedIn, myPageCtrl.update);
export default myPage;