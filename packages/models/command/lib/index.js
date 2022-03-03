"use strict";

const semver = require("semver");

const log = require("@sun-fe/log");
const { LOWEST_NODE_VERSION } = require("@sun-fe/constant");

class Command {
  constructor(argv) {
    if (!argv) {
      throw new Error("参数不能为空");
    }
    if (!Array.isArray(argv)) {
      throw new Error("参数必须是数组");
    }
    if (argv.length < 1) {
      throw new Error("参数列表不能为空");
    }
    this._argv = argv;
    this._lowestNodeVersion = LOWEST_NODE_VERSION;
    this.runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.prepare());
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err) => {
        log.error(err);
      });
    });
  }
  /**
   * 在任务开始前，暴露给子类一个修改局部参数的机会
   */
  prepare() {}

  /**
   * 检查node的版本信息
   */
  checkNodeVersion() {
    const currentNodeVersion = process.version;
    const lowestNodeVersion = this._lowestNodeVersion;
    if (!semver.gte(currentNodeVersion, lowestNodeVersion)) {
      throw new Error(`需要安装 v${lowestNodeVersion}以上版本的Node.js`);
    }
  }

  /**
   * 预处理Args
   * 初始化参数
   */
  initArgs() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
    log.debug("_argv", this._argv);
  }

  init() {
    throw new Error("Command继承类必须实现init方法");
  }

  exec() {
    throw new Error("Command继承类必须实现exec方法");
  }
}

module.exports = Command;
