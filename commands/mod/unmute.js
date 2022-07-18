const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const ms = require("ms");

module.exports = {
  name: "unmute",
  aliases: ["un-mute"],
  description: "Wycisz użytkownika.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["MUTE_MEMBERS"],

  run: async (client, message, args) => {
    try {
      const user = message.mentions.members.first();

      if (!user) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj użytkownika do zmutowania.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      user.timeout(0).then(() => {
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(
            `\`✅\` Pomyślnie odciszono użytkownika: <@${user?.id}>.`
          )
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
