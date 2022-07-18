const discord = require("discord.js");
const { prefix, color, errorColor } = require("../../config");
const timezone = require("moment-timezone");
const { readdirSync } = require("fs");

module.exports = {
  name: "help",
  aliases: ["h", "cmd"],
  description: "Centrum pomocy.",
  category: "misc",
  cooldown: 2,

  run: async (client, message, args) => {
    const emojis = {
      misc: "📁",
      mod: "🚨",
      info: "📚",
      fun: "😂",
      reactionroles: "📟",
    };

    const names = {
      misc: "Różne",
      mod: "Moderacyjne",
      info: "Informacyjne",
      fun: "4fun",
      reactionroles: "Role",
    };

    if (!args[0]) {
      const categories = readdirSync(`./commands/`);

      const embed = new discord.MessageEmbed()
        .setColor(color)
        .setDescription(`\`✅\` Ilość komend: ${client.commands.size}`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" })
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

      for (const category of categories) {
        const commands = client.commands
          .filter((cmd) => cmd.category === category)
          .map((cmd) => `\`${cmd.name}\``)
          .join(", ", "\n");
        embed.fields.push({
          name: `\`${emojis[category]}\` ${names[category]}`,
          value: `> ${commands}`,
          inline: false,
        });
      }

      return message.channel.send({
        embeds: [embed],
      });
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new discord.MessageEmbed()
          .setDescription(
            `Nieznana komenda! Użyj \`${prefix}help\` by poznać moje wszystkie komendy!`
          )
          .setColor(color);
        return message.channel.send({
          embeds: [embed],
        });
      }

      const embed = new discord.MessageEmbed()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" })
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .addField(
          "Komenda",
          command.name ? `\`${command.name}\`` : "Brak nazwy.",
          true
        )
        .addField(
          "Użycie",
          command.usage
            ? `\`${command.usage}\``
            : `\`${prefix}${command.name}\``,
          true
        )
        .addField(
          "Aliasy",
          `\`${
            command.aliases.length ? command.aliases.join(" | ") : "Brak."
          }\``,
          true
        )
        .addField(
          "Opis",
          command.description ? command.description : "Brak opisu.",
          true
        );
      return message.channel.send({
        embeds: [embed],
      });
    }
  },
};
