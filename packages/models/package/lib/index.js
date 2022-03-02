'use strict';

const path = require('path');
const fse = require('fs-extra');

const log = require('@sun-fe/log');
const { isObject, getLatestVersion } = require('@sun-fe/util');

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
            throw new Error('package参数必须是一个Object');
            this.targetPath = options.targetPath;
            this.storeDir = options.storeDir;
            this.packageName = options.packageName;
            this.packageVersion = options.packageVersion;
            this.cacheFilePathPrefix = this.packageName.replace('/', '_');
        }
    }

    get cacheFilePath() {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
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
        if (this.packageVersion === 'latest') {
            this.packageVersion = await getLatestVersion(this.packageName);
            log.debug('packageVersion', this.packageVersion);
        }
    }

    /**
     * 检查包是否存在
     */
    async exist() {
        // 如果存在storeDir，说明没有指定--targetPath，去缓存目录中去查找
        if (this.storeDir) {

        }
    }


}

module.exports = Package; 