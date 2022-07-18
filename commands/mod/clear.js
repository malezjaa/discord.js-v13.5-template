const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");

module.exports = {
  name: "clear",
  aliases: [],
  description: "Wyczyść wiadomośći",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["MANAGE_MESSAGES"],

  run: async (client, message, args) => {
    try {
      const messagesCount = parseInt(args[0]);

      if (!Number.isInteger(messagesCount)) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj liczbe wiadomości do usunięcia.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      if (messagesCount < 2 || messagesCount >= 100) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Liczba musi być większa od 1 lub mniejsza od 100."
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      message.channel.bulkDelete(messagesCount).then((res) => {
        let count = 0;
        res.map((msg) => ++count);
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie usunięto ${count} wiadomości.`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] }).then((msg) =>
          setTimeout(() => {
            msg.delete();
          }, 3000)
        );
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
