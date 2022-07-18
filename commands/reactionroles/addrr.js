const discord = require("discord.js");
const timezone = require("moment-timezone");
const { errorColor, color } = require("../../config");
const emojiRegex = require("emoji-regex");
const ReactionRole = require("../../database/models/reactionrole");
const Guild = require("../../database/models/guild");

module.exports = {
  name: "addrr",
  aliases: [],
  description: "Dodaje reaction role.",
  category: "reactionroles",
  cooldown: 5,

  run: async (client, message, args) => {
    try {
      const channel = message.mentions.channels.first();

      if (!channel) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj kanał na którym znajduje się wiadomość.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const chan = message.guild.channels.cache.get(channel.id);

      const messageId = args[1];

      if (!messageId) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            "`❌` Podaj id wiadomości na której pojawią się reakcje."
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const msg = await chan.messages.fetch(messageId).catch(async (err) => {
        console.log(err);
        if (err.code == 50035 || err.code == 10008 || err.httpStatus == 404) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription("`❌` Taka wiadomość nie istnieje.")
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });

          return message.channel.send({ embeds: [embed] });
        }
      });

      const role = message.mentions.roles.first();

      if (!role) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj role która zostanie nadana po reakcji.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const emoji = args[3];

      if (!emoji) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Podaj emotkę.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const emoteRegex = /<:.+:(\d+)>/gm;
      const animatedEmoteRegex = /<a:.+:(\d+)>/gm;

      if (emoteRegex.test(emoji) || animatedEmoteRegex.test(emoji)) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription("`❌` Nie używaj customowych emotek.")
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });

        return message.channel.send({ embeds: [embed] });
      }

      const regex = emojiRegex();
      for (const match of emoji.matchAll(regex)) {
        const em = match[0];

        const newRr = new ReactionRole({
          messageId: messageId,
          emoji: em,
          roleId: role.id,
          channelId: channel.id,
          guildId: message.guild.id,
        });

        const rr = await newRr.save();

        await msg.react(emoji);

        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie utworzono reactionrole.`)
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
