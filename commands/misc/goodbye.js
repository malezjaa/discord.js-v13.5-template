const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const Guild = require("../../database/models/guild");

module.exports = {
  name: "goodbye",
  aliases: [],
  description: "Configuracja pożegnań.",
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

      const firstOption = args[0];

      if (!firstOption) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            `\`❌\` Dostępne opcje: \`status, embed, image, channel, message\``
          )
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
          guild.addons.goodbye.enabled = true;
          guild.markModified("addons.goodbye");
          await guild.save();

          const embed = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`✅\` Pomyślnie włączono pożegnania.`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        } else if (secondOption == "off") {
          guild.addons.goodbye.enabled = false;
          guild.markModified("addons.goodbye");
          await guild.save();

          const embed1 = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`✅\` Pomyślnie wyłączono pożegnania.`)
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
      } else if (firstOption == "embed") {
        const secondOption = args[1];

        if (!secondOption) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(
              `\`❌\` Dostępne opcje: \`on, off\` (jeżeli ta funkcja będzie włączona wiadomość będzie pojawiała się w embedzie.)`
            )
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }

        if (secondOption == "on") {
          guild.addons.goodbye.embed = true;
          guild.markModified("addons.goodbye");
          await guild.save();

          const embed = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`✅\` Pomyślnie włączono wiadomość w embedzie.`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        } else if (secondOption == "off") {
          guild.addons.goodbye.embed = false;
          guild.markModified("addons.goodbye");
          await guild.save();

          const embed1 = new discord.MessageEmbed()
            .setColor(color)
            .setDescription(`\`✅\` Pomyślnie wyłączono wiadomość w embedzie.`)
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
      } else if (firstOption == "image") {
        const secondOption = args[1];

        if (!secondOption) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(
              `\`❌\` Nie podałeś zdjęcia. Jeżli zdjęcie będzie ustawione wtedy pojawi się w embedzie`
            )
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }

        guild.addons.goodbye.image = secondOption;
        guild.markModified("addons.goodbye");
        await guild.save();

        const embed1 = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie ustawiono zdjęcie.`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });
        return message.channel.send({ embeds: [embed1] });
      } else if (firstOption == "message") {
        const secondOption = args.slice(1).join(" ");

        if (!secondOption) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(
              `\`❌\` Nie podałeś wiadomości która będzie pojawiała się podczas pożegnania. Dostępne placeholdery: \`{userTag}\`, \`{serverMemberCount}\`, \`{guildName}\``
            )
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }

        guild.addons.goodbye.message = secondOption;
        guild.markModified("addons.goodbye");
        await guild.save();

        const embed1 = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie ustawiono wiadomość.`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });
        return message.channel.send({ embeds: [embed1] });
      } else if (firstOption == "channel") {
        const secondOption = message.mentions.channels.first();

        if (!secondOption) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription(
              `\`❌\` Nie podałeś kanału na którym będą wyświetlać się wiadomości.`
            )
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });
          return message.channel.send({ embeds: [embed] });
        }

        guild.addons.goodbye.channel = secondOption.id;
        guild.markModified("addons.goodbye");
        await guild.save();

        const embed1 = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie ustawiono kanał pożegnań.`)
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
