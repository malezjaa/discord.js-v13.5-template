const Guild = require("../database/models/guild");

module.exports = async (client, guild) => {
  try {
    const newGuild = await Guild.findOne({ id: guild.id });

    const g = await newGuild.remove();
  } catch (err) {
    console.log(err);
  }
};
