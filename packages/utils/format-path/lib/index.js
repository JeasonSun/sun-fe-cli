"use strict";
const path = require("path");

const formatPath = (p) => {
  if (p && typeof p === "string") {
    const sep = path.sep;
    if (sep === "/") {
      return p;
    } else {
      return p.replace(/\\/g, "/");
    }
  }
};

module.exports = formatPath;
