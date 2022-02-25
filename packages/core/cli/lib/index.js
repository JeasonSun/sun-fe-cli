"use strict";

const log = require("@sun-fe/log");
const prepare = require('./prepare');
const registerCommander = require('./registerCommander');

/**
 * @sun-fe/cli 核心入口
 * 1. 预检查
 * 2. 注册命令
 */
async function main() {
  try {
    await prepare(); // 命令准备阶段：预检查
    await registerCommander(); // 注册commander
  } catch (error) {
    log.error(error.message);
    log.debug(error);
  }
}

module.exports = main;
