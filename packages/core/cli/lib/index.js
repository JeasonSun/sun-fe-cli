"use strict";

const updateNotifier = require("update-notifier");

const log = require("@sun-fe/log");

const pkg = require("../package.json");

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
  checkUpdate(); // 检查版本更新
}

/**
 * 检查脚手架版本
 */
async function checkUpdate() {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7 * 0, // 1 week
  });
  notifier.notify();
  console.log(notifier);

  // Update available! 6.32.0 → 6.32.1.                │
  // │   Changelog: https://github.com/pnpm/pnpm/releases/tag/v6.32.1   │
  // │                 Run pnpm add -g pnpm to update.                  │
  // │                                                                  │
  // │      Follow @pnpmjs for updates: https://twitter.com/pnpmjs
}

/**
 * 2. 注册命令
 */
async function registerCommander() {}

module.exports = main;
