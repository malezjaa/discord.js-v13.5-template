const discord = require("discord.js");
const { prefix, errorColor, color } = require("../../config");
const Guild = require("../../database/models/guild");

module.exports = {
  name: "prefix",
  aliases: [],
  description: "Ustawia prefix bota.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["ADMINISTRATOR"],

  run: async (client, message, args) => {
    const newPrefix = args[0];

    if (!newPrefix) {
      const embed = new discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription("`❌` Podaj znak który chcesz by byl nowym prefixem.")
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
    }

    if (newPrefix.length > 2) {
      const embed = new discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription("`❌` Prefix nie może być dłuższy niż dwa znaki.")
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
    }

    const guild = await Guild.findOne({ id: message.guild.id });

    if (!guild) {
      const newGuild = new Guild({
        id: message.guild.id,
        prefix: newPrefix,
      });

      const savedGuild = await newGuild.save();

      const embed = new discord.MessageEmbed()
        .setColor(color)
        .setDescription(`\`✅\` Pomyślnie zmieniono prefix!`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
    } else {
      guild.prefix = newPrefix;
      await guild.save();

      const embed = new discord.MessageEmbed()
        .setColor(color)
        .setDescription(`\`✅\` Pomyślnie zmieniono prefix!`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
    }
  },
};
