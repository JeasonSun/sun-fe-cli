"use strict";

const path = require("path");
const fse = require("fs-extra");

/**
 * 动态加载执行包
 * 1. 如果有设置--targetPath,优先加载targetPath指定包
 * 2. 否则加载.registered_command中已经配置的命令指定包
 */
async function action() {
  let targetPath = process.env.CLI_TARGET_PATH;
  let storeDir = "";
  let pkg;
  const homePath = process.env.CLI_HOME_PATH;
  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name(); // 命令名称
  const registeredCommandPath = process.env.REGISTERED_COMMAND_PATH;
  const registeredCommand = fse.readJSONSync(registeredCommandPath);
  const packageName =
    registeredCommand[cmdName] && registeredCommand[cmdName]["package"];
  const packageVersion = "latest";

  if(!targetPath){
    
  }

  console.log(targetPath);
  console.log(homePath);
  console.log(cmdName);
  console.log(packageName);
}

module.exports = action;
