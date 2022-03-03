"use strict";

const Command = require("@sun-fe/command");

class InitCommand extends Command {
  init() {}
  exec() {}
}

function init(argv) {
  return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
