const mongoose = require("mongoose");
const chalk = require("chalk");
const { database } = require("../config");

mongoose
  .connect(database)
  .then(() => {
    console.log(
      chalk.hex("#1FAC64")(
        `✔️  SUCCESS ${chalk.hex("#1FAC64")(`Connected to database!`)}`
      )
    );
  })
  .catch((err) => console.log(chalk.red(err.message)));
