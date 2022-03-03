"use strict";
const cp = require("child_process");

const latestVersion = require("latest-version");
const log = require("@sun-fe/log");

/**
 * 是否是Object对象
 * @param {*} o
 * @returns
 */
const isObject = (o) => {
  return Object.prototype.toString.call(o) === "[object Object]";
};

/**
 * 获取最新版本
 * @param {*} packageName 包名称
 * @returns 版本号
 */
const getLatestVersion = async (packageName) => {
  if (!packageName) {
    return;
  }
  let lstVersion;
  try {
    lstVersion = await latestVersion(packageName);
  } catch (error) {
    log.error(`网络错误，获取${packageName}最新版本失败`);
  }
  return lstVersion;
};

const spawn = function (command, args, options = {}) {
  const win32 = process.platform === "win32";
  const cmd = win32 ? "cmd" : command;
  const cmdArgs = win32 ? ["/c"].concat(command, args) : args;
  return cp.spawn(cmd, cmdArgs, options);
};

/**
 * 异步执行子进程任务
 * @param {*} command
 * @param {*} args
 * @param {*} options
 * @returns
 */
const execAsync = function (command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    child.on("error", (e) => {
      reject(e);
    });

    child.on("exit", (code, error) => {
      if (code !== 0) {
        reject(error);
      } else {
        resolve(code);
      }
    });
  });
};

module.exports = {
  isObject,
  getLatestVersion,
  execAsync
};
