"use strict";
const path = require("path");

const updateNotifier = require("update-notifier");
const boxen = require("boxen");
const rootCheck = require("root-check");
const { homedir } = require("os");
const fse = require("fs-extra");
const dotenv = require("dotenv");
const log = require("@sun-fe/log");
const { DEFAULT_ENV_PATH, DEFAULT_CLI_HOME } = require("@sun-fe/constant");

const pkg = require("../package.json");
const userHome = homedir();

/**
 *  预检查: 命令准备阶段
 *  - 检查脚手架的版本信息，确认是否需要更新
 *  - 检查是否root用户，root用户需要自动降级处理
 *  - 检查用户的主目录，确认配置目录
 *  - 检查环境变量，加载环境变量
 */
async function prepare() {
  manualParse(); // 人工解析cli参数
  welcome(); // 欢迎词
  await checkUpdate(); // 检查版本更新
  checkRoot(); // 检查是否是root用户
  checkUserHome(); // 检查用户home目录
  checkEnv(); // 检查.env文件，加载环境变量
}

/**
 * 由于commander是在registerCommander后添加的
 * 在此之前的调试无法显示，
 * 因为并没有根据--debug修改log.level
 */
function manualParse() {
  const args = process.argv.slice(2);
  if (args.includes("-d") || args.includes("--debug")) {
    process.env.CLI_LOG_LEVEL = "verbose";
    log.level = process.env.CLI_LOG_LEVEL;
  }
}

function welcome() {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    align: "center",
    borderColor: "yellow",
    borderStyle: "round",
  };
  const message = `欢迎使用sun-fe-cli\n ${pkg.description} \n版本: v${pkg.version}`;
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
  if (!process.env.CLI_HOME) {
    process.env.CLI_HOME = DEFAULT_CLI_HOME;
  }
  const homePath = path.resolve(userHome, process.env.CLI_HOME);
  fse.ensureDirSync(homePath);
  process.env.CLI_HOME_PATH = homePath;
}

module.exports = prepare;
