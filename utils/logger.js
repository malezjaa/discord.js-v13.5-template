const chalk = require("chalk");
const moment = require("moment");

module.exports = class Logger {
  static log(content, type = "info") {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    switch (type) {
      case "info": {
        return console.log(
          chalk.hex("#1FAC64")(`ℹ️ INFO ${chalk.hex("#59a5e9")(content)}`)
        );
      }
      case "warn": {
        return console.log(
          chalk.hex("#1FAC64")(`⚠️ WARNING ${chalk.hex("#ffd966")(content)}`)
        );
      }
      case "error": {
        return console.log(
          chalk.hex("#1FAC64")(`❌ ERROR ${chalk.hex("#E06666")(content)}`)
        );
      }
      case "cmd": {
        return console.log(
          chalk.hex("#1FAC64")(`📁 COMMANDS ${chalk.hex("#1FAC64")(content)}`)
        );
      }
      case "event": {
        return console.log(
          chalk.hex("#1FAC64")(`🎈 EVENTS ${chalk.hex("#1FAC64")(content)}`)
        );
      }
      case "success": {
        return console.log(
          chalk.hex("#1FAC64")(`✔️  SUCCESS ${chalk.hex("#1FAC64")(content)}`)
        );
      }
      default:
        throw new TypeError(
          "Logger type must be either info, warn, error, cmd, event or success."
        );
    }
  }
};
