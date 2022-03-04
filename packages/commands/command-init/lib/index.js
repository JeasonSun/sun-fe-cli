"use strict";

const Command = require("@sun-fe/command");

class InitCommand extends Command {
  /**
   * 初始化部分
   * 1. 处理参数
   */
  init() {}
  
  exec() {}
}

function init(argv) {
  return new InitCommand(argv);
}
module.exports = init;
module.exports.InitCommand = InitCommand;
