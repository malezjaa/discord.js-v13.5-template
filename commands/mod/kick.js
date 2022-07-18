const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");

module.exports = {
  name: "kick",
  aliases: [],
  description: "Wyrzuć użytkownika.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["KICK_MEMBERS"],

  run: async (client, message, args) => {
    try {
      const user = message.mentions.members.first();

      const reason = args[1];

      if (!user) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj użytkownika do wyrzucenia.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      if (
        user.id == message.guild.ownerId ||
        user.id == message.author.id ||
        user.id == client.user.id
      ) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Próbujesz wyrzucić właściciela serwera, tego bota lub samego siebie."
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      if (!reason) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj powód wyrzucenia użytkownika.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      user.kick().then(() => {
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(
            `\`✅\` Pomyślnie wyrzucono użytkownika: <@${user?.id}> z powodem ${reason}`
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
