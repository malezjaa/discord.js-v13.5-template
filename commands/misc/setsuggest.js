const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const Guild = require("../../database/models/guild");

module.exports = {
  name: "setsuggest",
  aliases: [],
  description: "Configuracja propozycji.",
  category: "misc",
  cooldown: 2,
  memberpermissions: ["ADMINISTRATOR"],

  run: async (client, message, args) => {
    try {
      const guild = await Guild.findOne({ id: message.guild.id });

      if (!guild) {
        const newGuild = new Guild({
          id: message.guild.id,
        });

        const savedGuild = await newGuild.save();
      }

      if (!guild.addons.suggest) {
        guild.addons.suggest = {};

        await guild.save();
      }

      const firstOption = args[0];

      if (!firstOption) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(`\`❌\` Dostępne opcje: \`status\`, \`channel\``)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });
        return message.channel.send({ embeds: [embed] });
      }

      if (firstOption == "status") {
        const secondOption = args[1];

        if (!secondOption) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(`\`❌\` Dostępne opcje: \`on, off\``)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }

        if (secondOption == "on") {
          guild.addons.suggest.enabled = true;
          guild.markModified("addons.suggest");
          await guild.save();

          const embed = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`✅\` Pomyślnie włączono propozycje.`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        } else if (secondOption == "off") {
          guild.addons.suggest.enabled = false;
          guild.markModified("addons.suggest");
          await guild.save();

          const embed1 = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`✅\` Pomyślnie wyłączono propozycje.`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed1] });
        } else {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(`\`❌\` Nie znaleziono takiej opcji.`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }
      } else if (firstOption == "channel") {
        const channel = message.mentions.channels.first();

        if (!channel) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(`\`❌\` Podaj kanał propozycji.`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }

        guild.addons.suggest.channel = channel.id;
        guild.markModified("addons.suggest");
        await guild.save();

        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie ustawiono kanał sugesti.`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });
        return message.channel.send({ embeds: [embed] });
      } else {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(`\`❌\` Nie znaleziono takiej opcji.`)
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
