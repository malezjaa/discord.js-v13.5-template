const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const User = require("../../database/models/user");
const Warn = require("../../database/models/warn");

module.exports = {
  name: "warn",
  aliases: [],
  description: "Zwarnuj użytkownika.",
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
          .setDescription("`❌` Podaj użytkownika do zwarnowania.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      if (user.id == message.guild.ownerId || user.id == message.author.id) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Próbujesz zwarnować właściciela serwera lub samego siebie."
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
          .setDescription("`❌` Podaj powód zwarnowania użytkownika.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const ifUserExists = await User.findOne({ id: user.id });

      if (!ifUserExists) {
        const newUser = new User({ id: user.id, warns: [], userId: user.id });

        const savedUser = await newUser.save();
      }

      const newWarn = new Warn({
        id: ifUserExists.id,
        body: reason,
        count: ifUserExists.warnSize + 1,
        moderator: message.author.id,
        guildId: message.guild.id,
      });

      const warn = await newWarn.save();

      ifUserExists.warnSize = ifUserExists.warnSize + 1;
      await ifUserExists.save();

      const embed = new discord.MessageEmbed()
        .setColor(color)
        .setDescription(
          `\`✅\` Pomyślnie zwarnowano użytkownika: <@${user?.id}> z powodem ${reason}`
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
        .setDescription(`\`❌\` ${e}`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });
      message.channel.send({ embeds: [embed] });
    }
  },
};
