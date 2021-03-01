const vars = require("./vars");


function getRequestIp(req) {
  if (req.headers.hasOwnProperty("x-forwarded-for"))
    return req.headers["x-forwarded-for"].split(",")[0];
  else
    return req.connection.remoteAddress;
}


async function prehandler(ctx, next) {
  ctx.logger = vars.logger;

  const start = new Date();

  const clientIp = getRequestIp(ctx.req);
  ctx.logger.info(`Serving client [${clientIp}]...`);

  ctx.clientIp = clientIp;

  await next();

  ctx.set('X-Response-Time', `${new Date() - start}ms`);
}


module.exports = prehandler;

