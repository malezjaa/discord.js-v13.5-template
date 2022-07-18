const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color } = require("../../config");

module.exports = {
  name: "ping",
  aliases: [],
  description: "Ping bota.",
  category: "mod",
  cooldown: 5,

  run: async (client, message, args) => {
    try {
      const m = await message.channel.send("`🏓` Pingowanie...");
      const embed = new discord.MessageEmbed()
        .addField(
          "`⏳` Czas oczekiwania",
          `_**${m.createdTimestamp - message.createdTimestamp}ms**_`,
          true
        )
        .addField("`💓` API", `_**${client.ws.ping}ms**_`, true)
        .setColor(color)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      setTimeout(function () {
        m.edit({ content: " ", embeds: [embed] });
      }, 2000);
    } catch (e) {
      const embed = new discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription(`\`❌\` ${e.message}`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });
      message.channel.send({ embeds: [embed] });
    }
  },
};
