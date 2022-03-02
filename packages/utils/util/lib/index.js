'use strict';

const latestVersion = require('latest-version');
const log = require('@sun-fe/log');

const isObject = (o) => {
    return Object.prototype.toString.call(o) === '[object Object]'
}

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

}


module.exports = {
    isObject,
    getLatestVersion
}