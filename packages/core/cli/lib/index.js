"use strict";
const path = require("path");
const fs = require("fs");

const updateNotifier = require("update-notifier");
const boxen = require("boxen");
const rootCheck = require("root-check");
const { homedir } = require("os");
const fse = require("fs-extra");
const dotenv = require("dotenv");

const log = require("@sun-fe/log");
const {
  DEFAULT_ENV_PATH,
  DEFAULT_CLI_HOME,
  REGISTERED_COMMAND,
} = require("@sun-fe/constant");

const pkg = require("../package.json");
const cli = require("./cli");

const userHome = homedir();

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

/**
 *  1.预检查: 命令准备阶段
 *  - 检查脚手架的版本信息，确认是否需要更新
 *  - 检查是否root用户，root用户需要自动降级处理
 *  - 检查用户的主目录，确认配置目录
 *  - 检查环境变量，加载环境变量
 */
async function prepare() {
  welcome(); // 欢迎词
  await checkUpdate(); // 检查版本更新
  checkRoot(); // 检查是否是root用户
  checkUserHome(); // 检查用户home目录
  checkEnv(); // 检查.env文件，加载环境变量
}

function welcome() {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    align: "center",
    borderColor: "yellow",
    borderStyle: "round",
  };
  const message = `欢迎使用sun-fe-cli前端统一脚手架
    当前版本: v${pkg.version}`;
  const content = boxen(message, boxenOptions);
  console.log(content);
}

/**
 * 检查脚手架版本
 */
async function checkUpdate() {
  const notifier = await updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7 * 0, // 1 week
  });
  notifier.notify();
}

/**
 * 检查是否为root用户
 * 如果是root用户，需要降级处理，以免后续操作权限受制
 */
function checkRoot() {
  rootCheck();
}

/**
 * 检查当前登录用户的主目录
 */
function checkUserHome() {
  if (!userHome || !fse.pathExistsSync(userHome)) {
    throw new Error("当前登录用户主目录不存在");
  }
}

/**
 * 1. 检查.env文件，使用dotenv加载环境变量
 * 2. 初始化CLI_HOME_PATH
 */
function checkEnv() {
  const dotenvPath = path.resolve(userHome, DEFAULT_ENV_PATH);
  if (fse.pathExistsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  if (!process.env.CLI_HOME_PATH) {
    process.env.CLI_HOME_PATH = DEFAULT_CLI_HOME;
  }
  const homePath = path.resolve(userHome, process.env.CLI_HOME_PATH);
  fse.ensureDirSync(homePath);
}

/**
 * 2. 注册命令
 * 命令分为：内置命令和扩展命令
 * - 注册全局命令，以便第一时间开启全局参数
 * - 初始化内置命令信息，并且写入配置文件
 * - 去本地配置目录中读取已经配置的命令
 */
async function registerCommander() {
  const cmdBin = Object.keys(pkg.bin)[0];

  cli()
  .parse(process.argv.slice(2));

  const registeredCommandPath = path.resolve(
    process.env.CLI_HOME_PATH,
    REGISTERED_COMMAND
  );

  if (fse.existsSync(registeredCommandPath)) {
    log.debug("存在已注册命令配置文件,读取并注册");
  } else {
    log.debug("已注册命令配置文件不存在,需要注册内置命令");
  }
}

module.exports = main;
