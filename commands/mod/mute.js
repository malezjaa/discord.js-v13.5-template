const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const ms = require("ms");

module.exports = {
  name: "mute",
  aliases: [],
  description: "Wycisz użytkownika.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["MUTE_MEMBERS"],

  run: async (client, message, args) => {
    try {
      const user = message.mentions.members.first();

      const reason = args[1];

      const time = args[2];

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

      if (
        user.id == message.guild.ownerId ||
        user.id == message.author.id ||
        user.id == client.user.id
      ) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Próbujesz zmutować właściciela serwera, tego bota lub samego siebie."
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
          .setDescription("`❌` Podaj powód zmutowania użytkownika.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      if (!time) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Nie podałeś czasu zmutowania. `(czas podawaj w minutach np: .mute @user123 spam 20)`"
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      user.timeout(ms(time) * 60 * 1000, reason).then(() => {
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(
            `\`✅\` Pomyślnie zmutowano użytkownika: <@${user?.id}> z powodem ${reason}`
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
