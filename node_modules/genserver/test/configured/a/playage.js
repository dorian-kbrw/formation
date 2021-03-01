function makeYouOld(args) {
  if (isNaN(parseInt(args.age)))
    throw new Error("age should be number");

  return Object.assign({}, args, { age: Number(args.age) * 2 });
}

function makeYouYoung(args) {
  if (isNaN(parseInt(args.age)))
    throw new Error("age should be number");

  return Object.assign({}, args, { age: Number(args.age) / 2 });
}


module.exports = {
  makeYouOld,
  makeYouYoung,
}
