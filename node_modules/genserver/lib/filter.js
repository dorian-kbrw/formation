const { FilterError } = require("./errors");
const vars = require("./vars");


/**
 * The exception raised by `require` will not be throw out directly. Because
 * the error info will be returned to user.
 */
function loadFilter() {
  if (vars.config.filter) {
    try {
      return require(`${process.cwd()}/${vars.config.filter}`);
    } catch (e) {
      throw new FilterError("Failed loading user filter");
    }
  } else {
    return emptyFilter;
  }
}


/**
 * The empty filter do nothing, just to keep the koa chain connected.
 */
async function emptyFilter(ctx, next) {
  await next();
}



module.exports = loadFilter();

