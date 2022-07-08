//로그인해야만 글쓰기, 수정, 삭제
const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    console.log("로그인상태아님");
    ctx.status = 401; //로그인 상태가 아니면 401반환
    return;
  }
  console.log("로그인됨");
  return next();
};

export default checkLoggedIn;