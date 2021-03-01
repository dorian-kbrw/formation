function makeYouOld(args) {
  return Object.assign({}, args, { age: Number(args.age) * 2 });
}

function makeYouYoung(args) {
  return Object.assign({}, args, { age: Number(args.age) / 2 });
}


module.exports = {
  makeYouOld,
  makeYouYoung,
}
