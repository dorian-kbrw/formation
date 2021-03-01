const fs = require("fs");
const { ActionError } = require("./errors");
const vars = require("./vars");


/**
 * User configured action path comes from the global configuration. The path is
 * a relative path like "./actions".
 */
const actionPath = `${process.cwd()}/${vars.config.actionPath}`;


/**
 * Load all user action at once. So that next time you require the action, it
 * will be already in the cache.
 */
function preloadActions() {
  fs.readdirSync(actionPath).forEach(x => require(`${actionPath}/${x}`));
}


/**
 * Load action from user's action path. This is a simple wrapper for "require"
 * function in Node.js.
 */
function loadAction(actionName) {
  try {
    return require(`${actionPath}/${actionName}`);
  } catch (e) {
    throw new ActionError(`Load action '${actionName}' error`);
  }
}


/**
 * Call the cmd of a action. args is an object that will be passed to cmd.
 */
async function handleAction(name, cmd, args) {
  const action = loadAction(name);

  if (typeof action[cmd] !== "function")
    throw new ActionError(`Command '${cmd}' not found`);
  else
    return await action[cmd](args);
}


module.exports = {
  preloadActions,
  handleAction,
};
