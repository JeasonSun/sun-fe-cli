"use strict";
const path = require("path");

const { Command} = require("commander");
const dedent = require("dedent");
const fse = require("fs-extra");

const log = require("@sun-fe/log");
const { REGISTERED_COMMAND, INTERNAL_COMMAND } = require("@sun-fe/constant");

const pkg = require("../package.json");
const program = new Command();
/**
 * 注册命令
 * 命令分为：内置命令和扩展命令
 * - 注册全局命令，以便第一时间开启全局参数
 * - 初始化内置命令信息，并且写入配置文件
 * - 去本地配置目录中读取已经配置的命令
 */
async function registerCommander() {
  const cmdBin = Object.keys(pkg.bin)[0];

  program
    .name(cmdBin)
    .usage("<command> [options]")
    .description(pkg.description)
    .version(pkg.version, "-v, --version", "显示当前版本")
    .option("-d, --debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "指定本地调试文件路径", "")
    .helpOption("-h, --help", "查看帮助");

    program
    .command("init [projectName]")
    .option("-f, --force", "是否强制初始化项目")
    .action(function(){
      console.log(arguments)
    });

  program.addHelpText(
    "after",
    dedent(`
    Examples:
      $ ${cmdBin} --help`)
  );

  const options = program.opts();

  program.on("option:debug", function () {
    if (options.debug) {
      process.env.CLI_LOG_LEVEL = "verbose";
      log.level = process.env.CLI_LOG_LEVEL;
      log.debug("开启debug模式");
    }
  });

  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = options.targetPath;
    log.debug("设置环境变量:CLI_TARGET_PATH", options.targetPath);
  });

  program.parse(process.argv);

  

  const registeredCommandPath = path.resolve(
    process.env.CLI_HOME_PATH,
    REGISTERED_COMMAND
  );

  if (!fse.existsSync(registeredCommandPath)) {
    log.debug("自动写入内置命令配置");
    fse.ensureFileSync(registeredCommandPath);
    fse.writeJSONSync(registeredCommandPath, INTERNAL_COMMAND, { spaces: 2 });
    log.debug("写入内置命令配置文件成功");
  }
  const registerCommanderData = fse.readJSONSync(registeredCommandPath);

  // addCommander(program, registerCommanderData);

  
}

/**
 * 动态加载command命令
 * @param {*} program
 * @param {*} commandData
 */
function addCommander(program, commandData = {}) {
  const commandKeys = Object.keys(commandData);
  console.log(commandKeys)
  program
    .command("publish")
    .option("-rs, --resetServerType", "是否重置git托管平台")
    .option("-rt, --resetToken", "是否重置GitToken")
    .action((...args) => {
      console.log(args)
    });
  commandKeys.forEach((key) => {
    
    // const commandOptions = commandData[key] || {};
    // const { command, argument = [], option = [] } = commandOptions;
    // if (command) {
    //   const subCommand = new Command(command);
    //   argument.forEach((arg) => {
    //     subCommand.addArgument(new Argument(arg, "测试"));
    //   });
    //   option.forEach((opt) => {
    //     subCommand.addOption(new Option(opt.key, opt.description));
    //   });
    //   program.addCommand(subCommand);
    // }
  });
}

module.exports = registerCommander;