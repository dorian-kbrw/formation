var cnt = 0;


async function filter(ctx, next) {
  if (cnt++ % 2 === 1)
    ctx.body = "You are odd";
  else
    await next();
}


module.exports = filter;
