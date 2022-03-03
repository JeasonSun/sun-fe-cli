"use strict";

const path = require("path");
const fse = require("fs-extra");

const Package = require("@sun-fe/package");
const log = require("@sun-fe/log");
const { execAsync } = require("@sun-fe/util");

/**
 * 动态加载执行包
 * 1. 如果有设置--targetPath,优先加载targetPath指定包
 * 2. 否则加载.registered_command中已经配置的命令指定包
 */
/**
 * packageName: 加载命令的npm包名称
 * packageVersion: npm包的版本
 * targetPath: 包项目的最外层目录
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

  if (!targetPath) {
  } else {
    pkg = new Package({
      packageName,
      packageVersion,
      targetPath,
    });
  }

  const rootFile = pkg.getRootFilePath();
  if (!rootFile) {
    throw new Error(`${packageName}入口文件不存在，请检查配置`);
  }
  log.debug("即将执行的文件为:", rootFile);
  try {
    const args = Array.from(arguments);
    const o = Object.create(null);
    const cmd = args[args.length - 1];
    for (let key in cmd) {
      if (cmd.hasOwnProperty(key) && !key.startsWith("_") && key !== "parent") {
        o[key] = cmd[key];
      }
    }
    args[args.length - 1] = o;
    const code = `require('${rootFile}').call(null, ${JSON.stringify(args)});`;

    try {
      const resCode = await execAsync("node", ["-e", code], {
        cwd: process.cwd(),
        stdio: "inherit",
      });
      process.exit(resCode);
    } catch (error) {
      log.error(error);
      process.exit(1);
    }
  } catch (error) {
    log.error(`执行${packageName}失败`);
  }
}

module.exports = action;
