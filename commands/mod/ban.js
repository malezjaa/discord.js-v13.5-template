const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");

module.exports = {
  name: "ban",
  aliases: [],
  description: "Zbanuj użytkownika.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["BAN_MEMBERS"],

  run: async (client, message, args) => {
    try {
      const user = message.mentions.members.first();

      const reason = args[1];

      if (!user) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj użytkownika do zbanowania.")
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
        user.id == client.member.id
      ) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Próbujesz zbanować właściciela serwera, tego bota lub samego siebie."
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
          .setDescription("`❌` Podaj powód zbanowania użytkownika.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      user.ban().then(() => {
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(
            `\`✅\` Pomyślnie zbanowano użytkownika: <@${user?.id}> z powodem ${reason}`
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
