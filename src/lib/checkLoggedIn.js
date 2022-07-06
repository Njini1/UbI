//로그인해야만 글쓰기, 수정, 삭제
const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = 401; //로그인 상태가 아니면 401반환
    return;
  }
  return next();
};

export default checkLoggedIn;