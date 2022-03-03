"use strict";

const path = require("path");
const fse = require("fs-extra");
const pkgDir = require("pkg-dir").sync;

const log = require("@sun-fe/log");
const { isObject, getLatestVersion } = require("@sun-fe/util");
const formatPath = require("@sun-fe/format-path");

/**
 * Package模块
 * 1. 检查指定缓存下是否存在某package
 * 2. 获取package的package.json文件，找到入口
 * 3. 对package进行安装
 * 4. 对package进行升级
 */
class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error("package参数必须是一个Object");
    }
    this.targetPath = options.targetPath;
    this.storeDir = options.storeDir;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
    this.cacheFilePathPrefix = this.packageName.replace("/", "_");
  }

  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    );
  }

  /**
   * 预检查
   * 1. storeDir是否存在
   * 2. 兼容latest版本为最新版本号
   */
  async prepare() {
    if (this.storeDir) {
      fse.ensureDirSync(this.storeDir);
    }
    if (this.packageVersion === "latest") {
      this.packageVersion = await getLatestVersion(this.packageName);
      log.debug("packageVersion", this.packageVersion);
    }
  }

  /**
   * 检查包是否存在
   */
  async exist() {
    // 如果存在storeDir，说明没有指定--targetPath，去缓存目录中去查找
    if (this.storeDir) {
      await this.prepare();
      log.debug("cacheFilePath", this.cacheFilePath);
      return fse.pathExistsSync(this.cacheFilePath);
    } else {
      return fse.pathExistsSync(this.targetPath);
    }
  }

  /**
   * 获取npm包中的入口文件
   */
  getRootFilePath() {
    function _getRootFile(targetPath) {
      // 判断targetPath是否真实存在
      if (!fse.existsSync(targetPath)) {
        return null;
      }
      // 获取package.json所在目录： pkg-dir
      const pkgHome = pkgDir(targetPath);
      log.debug("package目录", pkgHome);
      // 根据package.json解析入口
      if (pkgHome) {
        const pkgFile = require(path.resolve(pkgHome, "package.json"));
        // 3. 路径兼容处理
        if (pkgFile && pkgFile.main) {
          return formatPath(path.resolve(pkgHome, pkgFile.main));
        }
      }
      return null;
    }
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath);
    } else {
      return _getRootFile(this.targetPath);
    }
  }
}

module.exports = Package;
