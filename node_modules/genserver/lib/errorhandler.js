const { UserErrorHandlerError } = require("./errors");
const vars = require("./vars");


/**
 * The user defined error handler should be loaded at startup. Because it not
 * supposed to change configuration at runtime, and this may raise exceptions.
 */
const errorHandler = getUserErrorHandler();



/**
 * A wrapper for require, will throw specific type of error when failed.
 */
function getUserErrorHandler() {
  if (vars.config.errorHandler) {
    try {
      return require(`${process.cwd()}/${vars.config.errorHandler}`);
    } catch (e) {
      throw new UserErrorHandlerError("Failed loading user error handler");
    }
  } else {
    return defaultHandler;
  }
}


/**
 * By default, just return the message of an Error object only.
 */
function defaultHandler(e, ctx) {
  return { error: `<${e.name}> ${e.message}` };
}


/**
 * Some gateway will treat 500 response in a unexpected way, so it's better
 * to return 200, and use the response JSON to represent error info.
 *
 * You should always use this as the first Koa middleware.
 */
function errorDispatcher(e, ctx) {
  ctx.body = JSON.stringify(errorHandler(e, ctx));
  ctx.set('Content-Type', 'application/json');

  if (vars.config.emitError)
    ctx.app.emit("error", e, ctx);
}


/**
 * The Koa middleware to be exported.
 */
async function handler(ctx, next) {
  try {
    await next();
  } catch (e) {
    errorDispatcher(e, ctx);
  }
}


module.exports = handler;
