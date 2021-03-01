class UserErrorHandlerError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "UserErrorHandlerError", message);
  }
}


class FilterError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "FilterError", message);
  }
}


class RouteError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "RouteError", message);
  }
}


class ActionError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "ActionError", message);
  }
}


function errorObjInitializer(name, message) {
  if (message instanceof Error)
    this.message = message.message;
  else
    this.message = message;
  this.name = name;
}


module.exports = {
  UserErrorHandlerError,
  FilterError,
  RouteError,
  ActionError,
};
