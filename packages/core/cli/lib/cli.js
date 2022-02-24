"use strict";
const yargs = require("yargs/yargs");
const log = require("@sun-fe/log");
const { boolean } = require("yargs");

function sunCLI(argv, cwd) {
  const cli = yargs(argv, cwd);

  return globalOptions(cli)
    .usage("Usage: $0 <command> [options]")
    .demandCommand(
      1,
      "至少需要一个command, 添加参数 --help 查看可用command和options"
    )
    .recommendCommands()
    .strict()
    .fail((msg, err) => {
      const actual = err || new Error(msg);
      if (actual.name !== "ValidationError" && !actual.pkg) {
        // the recommendCommands() message is too terse
        if (/Did you mean/.test(actual.message)) {
          log.error(`Unknown command "${cli.parsed.argv._[0]}"`);
        }
        log.error(actual.message);
      }
      cli.exit(actual.exitCode > 0 ? actual.exitCode : 1, actual);
    })
    .alias("h", "help")
    .alias("v", "version")
    .wrap(cli.terminalWidth());
}

function globalOptions(yargs) {
  const opts = {
    debug: {
      default: false,
      type: "boolean",
      alias: "d",
      describe: "是否开启debug模式",
    },
  };
  const globalKeys = Object.keys(opts).concat(["help", "version"]);
  return yargs
    .options(opts)
    .group(globalKeys, "全局参数")
    .option("ci", { type: "boolean" });
}

module.exports = sunCLI;
