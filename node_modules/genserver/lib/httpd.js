const errorhandler = require("./errorhandler");
const prehandler = require("./prehandler");
const cors = require("./cors");
const filter = require("./filter");
const router = require("./router");

const Koa = require("koa");

const app = new Koa();

app.use(errorhandler);
app.use(prehandler);
app.use(cors);
app.use(filter);
app.use(router);

app.on('error', console.error);


module.exports = app;

