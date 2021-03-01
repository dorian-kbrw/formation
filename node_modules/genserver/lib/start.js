#! /usr/bin/env node

const version = require("../package.json").version;
const vars = require("./vars");
const fs = require("fs");



/**
 * Print all configurations. This should be called after function loadConfig.
 */
function printStartupInfo() {
  console.log(`Starting genserver@${version} with following configurations:`);
  Object.entries(vars.config)
    .forEach(([k, v]) => console.log(`${k.padEnd(30)}${v}`));
}



/**
 * Load configuration from JSON file and merge it to default configuration.
 */
function loadConfig(fileName) {
  const configFile = `${process.cwd()}/${fileName}`;
  const userConfig = fs.existsSync(configFile) ? require(configFile) : {};
  Object.assign(vars.config, userConfig);
}


/**
 * Supported usage: `genserver --version` or `genserver nondefault.json`
 */
function parseArgument() {
  const [ _a, _b, arg ] = process.argv;
  if (arg === "--version" || arg === "-v")
    printAndExit(version);

  if (arg === undefined)
    return loadConfig("genserver.json");

  if (arg.endsWith(".json"))
    return loadConfig(arg);

  printAndExit("Usage: genserver [genserverconfig.json]");
}


function printAndExit(info) {
  console.log(info);
  process.exit(0);
}



parseArgument();

if (vars.config.logModule)
  vars.logger = require(`${process.cwd()}/${vars.config.logModule}`);
else
  vars.logger = require("colourlogger").getLogger("genserver");

if (vars.config.showStartupInfo)
  printStartupInfo();


require("./httpd").listen(vars.config.port);

