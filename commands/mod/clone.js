const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");

module.exports = {
  name: "clone",
  aliases: ["clone-channel", "channel-clone"],
  description: "Sklonuj kanał.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["MANAGE_CHANNELS"],

  run: async (client, message, args) => {
    try {
      const channel = message.mentions.channels.first();

      if (!channel) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj kanał do sklonowania.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      channel.clone().then(() => {
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie skolonwano kanał: <#${channel.id}>`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      });
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
