function errorHandler(e, ctx) {
  const i = `[${e.name}]<${ctx.query.cmd}>${e.message}`;
  ctx.logger.error(`[${ctx.clientIp}]${i}`);
  return { error: i, code: 60001 };
}


module.exports = errorHandler;

