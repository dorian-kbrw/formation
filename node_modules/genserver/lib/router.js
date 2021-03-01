const { handleAction } = require("./action");
const { inspect } = require("util");
const { RouteError } = require("./errors");


/**
 * Return the last field of a pathname. e.g. "/a/b/c/d/aname" ==> "aname"
 */
function getActionName(pathname) {
  const fields = pathname.split(/\/+/);
  const actionName = fields[fields.length - 1] || fields[fields.length - 2];
  if (!actionName)
    throw new RouteError(`No action name in URL '${pathname}'`);

  return actionName;
}


/**
 * The Koa middleware to be exported.
 */
async function router(ctx, next) {
  if (ctx.path.endsWith("favicon.ico"))
    return;

  const { cmd, ...args } = ctx.query;
  if (!cmd)
    throw new RouteError(`Argument 'cmd' not found`);

  const actionName = getActionName(ctx.path);

  ctx.logger.info(`Calling ${actionName}.${cmd}(${inspect(args)})`);
  const r = await handleAction(actionName, cmd, args);

  ctx.body = JSON.stringify(r);
  ctx.set('Content-Type', 'application/json');

  await next();
}


module.exports = router;

