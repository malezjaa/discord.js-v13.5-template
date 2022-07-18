const Guild = require("../database/models/guild");

module.exports = async (client, guild) => {
  try {
    const newGuild = new Guild({
      id: guild.id,
      prefix: ".",
      modActions: [],
    });

    const g = await newGuild.save();
  } catch (err) {
    console.log(err);
  }
};
