const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const User = require("../../database/models/user");
const Warn = require("../../database/models/warn");

module.exports = {
  name: "warns",
  aliases: ["warninfo", "warn-info"],
  description: "Warny użytkownika.",
  category: "mod",
  cooldown: 5,

  run: async (client, message, args) => {
    try {
      const user = message.mentions.members.first();

      if (!user) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj użytkownika.")
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

        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Użytkownik nie posiada warnów`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const allWarns = await Warn.find({
        id: user.id,
        guildId: message.guild.id,
      });
      console.log(allWarns);
      if (!allWarns || allWarns.length === 0) {
        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Użytkownik nie posiada warnów`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      } else {
        const warnsList = allWarns
          .map(
            (element) =>
              `\`⚠️\` \`${element.count}\` **|** \`Moderator:\` <@${element.moderator}> - **${element.body}** \n `
          )
          .join("");

        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(
            `\`👤\` Warny użytkownika <@${user.id}> \n ${warnsList}`
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }
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
