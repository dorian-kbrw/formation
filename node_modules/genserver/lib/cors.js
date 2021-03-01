/**
 * OPTIONS request need response with header "Access-Control-Allow-Methods".
 * The "Access-Control-Max-Age" is optional, but it can avoid unnecessary
 * OPTIONS request.
 *
 * And OPTIONS request have an empty body.
 */
function handleOPTIONS(ctx) {
  ctx.set("Access-Control-Allow-Methods", "HEAD, GET, PUT, DELETE, POST");
  ctx.set("Access-Control-Max-Age", 24 * 60 * 60);
  ctx.body = "";
}


/**
 * This function is a Koajs middleware, and `app.use(cors)` is the right way
 * to use it.
 *
 * When you need CORS work with cookie, you need to set this header to true:
 * Access-Control-Allow-Credentials
 *
 * When CORS request come with a "Access-Control-Request-Headers" header,
 * you need to give back a "Access-Control-Allow-Headers".
 *
 */
async function cors(ctx, next) {
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Origin", "*");

  if (ctx.headers["access-control-request-headers"])
    ctx.set("Access-Control-Allow-Headers", "content-type");

  if (ctx.method === "OPTIONS")
    handleOPTIONS(ctx);
  else
    await next();
}


module.exports = cors;
