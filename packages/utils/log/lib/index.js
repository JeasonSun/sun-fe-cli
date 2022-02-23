"use strict";

const log = require("npmlog");

log.level = process.env.CLI_LOG_LEVEL ? process.env.CLI_LOG_LEVEL : "verbose";

log.addLevel("verbose", 1000, { fg: "magenta", bg: "black" }, "☼ Verbose ☼");
log.addLevel("debug", 1000, { fg: "cyan", bg: "black" }, "☼ Debug   ☼");

log.addLevel("info", 2000, { fg: "white", bg: "black" }, "☼ Info    ☼");
log.addLevel("notice", 3500, { fg: "red", bg: "black" }, "☼ Notice  ☼");
log.addLevel("warn", 4000, { fg: "white", bg: "yellow" }, "☼ Warn    ☼");
log.addLevel("error", 5000, { fg: "white", bg: "Red" }, "☼ ERROR   ☼");
log.addLevel("success", 5000, { fg: "white", bg: "green" }, "☼ Success ☼");

log.prefixStyle = { fg: "white" };

module.exports = log;
