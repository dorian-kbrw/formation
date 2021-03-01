function upper(args) {
  return Object.assign({}, args, { name: args.name.toUpperCase() });
}

function lower(args) {
  return Object.assign({}, args, { name: args.name.toLowerCase() });
}


module.exports = {
  upper,
  lower,
}
