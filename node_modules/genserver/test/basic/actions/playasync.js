function delay(milliseconds) {
  return new Promise((res, _) => setTimeout(res, milliseconds));
}

async function delayEcho(args) {
  await delay(2000);
  return args;
}


module.exports = {
  delayEcho,
}
