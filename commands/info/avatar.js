const discord = require("discord.js");
const { prefix, color, errorColor } = require("../../config");
const timezone = require("moment-timezone");
const { readdirSync } = require("fs");
const moment = require("moment");

module.exports = {
  name: "avatar",
  aliases: ["my-avatar"],
  description: "Pokazuje avatar!",
  category: "info",
  cooldown: 2,

  run: async (client, message, args) => {
    const user = message.mentions.members.first() || message.member;

    const embed = new discord.MessageEmbed()
      .setColor(color)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `\`📷\` [\`Link\`](${user.displayAvatarURL({ format: "png" })})`
      )
      .setFooter({ text: "Lotrus Bot" })
      .setImage(user.displayAvatarURL({ dynamic: true }));

    return message.channel.send({ embeds: [embed] });
  },
};
