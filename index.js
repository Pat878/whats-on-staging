#!/usr/bin/env node
require('dotenv').config({path: __dirname + '/.env'})
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const cmd = args._[0];

switch (cmd) {
  case "login":
    require("./cmds/login")(args);
    break;
  case "deploy":
    require("./cmds/deploy")(args);
    break;
  default:
    console.error(`"${cmd}" is not a valid command!`);
    break;
}
