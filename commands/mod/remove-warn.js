const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const User = require("../../database/models/user");
const Warn = require("../../database/models/warn");

module.exports = {
  name: "remove-warn",
  aliases: ["delte-warn"],
  description: "Usuń warna.",
  category: "mod",
  cooldown: 5,
  memberpermissions: ["KICK_MEMBERS"],

  run: async (client, message, args) => {
    try {
      const user = message.mentions.members.first();
      const option = args[1];

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

      const ifUserExists = await User.findOne({ id: user.id }).populate(
        "warns"
      );

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

      if (!ifUserExists?.warns) {
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

      if (!option) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Podaj numer warna który chcesz usunąć, lub wpisz all by usunąć wszystkie."
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      if (option == "all") {
        await ifUserExists.updateOne({ warns: [] });
        ifUserExists.warnSize = 0;
        await ifUserExists.save();

        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription("`✅` Pomyślnie usunięto wszystkie warny!")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      } else {
        const warn = await Warn.findOne({ count: parseInt(option) });

        if (warn) {
          await ifUserExists.warns.pull(warn._id);
          if (ifUserExists.warns.length > 0) {
            ifUserExists.warnSize = ifUserExists.warnSize - 1;
          }

          await warn.deleteOne();

          await ifUserExists.save();

          const embed = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(
              `\`✅\` Pomyślnie usunięto warna o numerze: ${option}!`
            )
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });

          return message.channel.send({ embeds: [embed] });
        } else {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription("`❌` Nie znaleziono warna o podanym numerze.")
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });

          return message.channel.send({ embeds: [embed] });
        }
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
