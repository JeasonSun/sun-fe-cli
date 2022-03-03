"use strict";

module.exports = {
  // 默认的.env文件的路径
  DEFAULT_ENV_PATH: ".sun-fe.env",
  // 默认@sun-fe/cli的配置&缓存主目录
  DEFAULT_CLI_HOME: ".sun-fe",
  // 内置命令信息：
  INTERNAL_COMMAND: {
    init: {
      package: "@sun-fe/init",
      command: "init",
      argument: [
        {
          key: "projectName",
          description: '项目名称'
        }
      ],
      option: [
        {
          key: "-f, --force",
          default: false,
          description: "是否强制初始化项目",
        },
      ],
    },
  },
  // 已经注册的扩展命令信息
  REGISTERED_COMMAND: ".registered_command",
  LOWEST_NODE_VERSION: '12.0.0'
};
