#!/usr/bin/env node

const importLocal = require("import-local");
const log = require("@sun-fe/log");

/**
 * 通过importLocal判断本地项目中是否安装了@sun-fe/cli
 * 如果已经安装，优先使用本地的node_module/@sun-fe/cli
 * 否则使用全局的@sun-fe/cli
 */
if (importLocal(__filename)) {
  log.info("优先使用本地的sun-fe-cli命令");
} else {
  require("../lib")(process.argv.slice(2));
}
