const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");

module.exports = {
  name: "8ball",
  aliases: [],
  description: "Znajdź odpowiedź na nurtujące cię pytanie.",
  category: "fun",
  cooldown: 3,

  run: async (client, message, args) => {
    try {
      const msg = args.slice(0).join(" ");

      if (!msg) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Zadaj pytanie.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const messages = [
        "Tak",
        "Nie",
        "Bardzo możliwe",
        "Możliwe",
        "Nie mam pojęcia",
        "Niemożliwe",
        "Jeszcze nie wiem",
        "Zdecydowanie",
        "Nie licz na to",
        "",
      ];

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      const embed = new discord.MessageEmbed()
        .setColor(color)
        .setDescription(
          `\`🎱\` Twoje pytanie: ${msg} \n \`💬\` Odpowiedź: ${randomMessage}`
        )
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
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
