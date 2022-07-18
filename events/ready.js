const { prefix } = require("../config");
const Guild = require("../database/models/guild");

module.exports = async (client) => {
  client.user.setPresence({
    status: "idle",
  });
  function randomstatus() {
    let status = [
      `${prefix}help | ${client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
      )} Members 👥`,
      `${prefix}help | ${client.guilds.cache.size} Server 🌐`,
      `${prefix}help | 24/7 ONLINE...!`,
    ];
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], {
      type: "PLAYING",
    });
  }
  setInterval(randomstatus, 15000);

  client.logger.log(
    `> 🔍 • Check All Server is ${client.guilds.cache.size} Server 🌐`,
    "info"
  );
  client.logger.log(
    `> ✅ • Successfully logged on as ${client.user.username}\n\n======================================`,
    "success"
  );
};
