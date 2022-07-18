const discord = require("discord.js");
const timezone = require("moment-timezone");
const { errorColor, color } = require("../../config");
const emojiRegex = require("emoji-regex");
const ReactionRole = require("../../database/models/reactionrole");
const Guild = require("../../database/models/guild");

module.exports = {
  name: "removerr",
  aliases: [],
  description: "Usuwa reaction role.",
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
            "`❌` Podaj id wiadomości na której znajduje się reakcja."
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

      const emoji = args[2];

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

        const newRr = await ReactionRole.findOne({
          messageId: messageId,
          emoji: em,
          channelId: channel.id,
          guildId: message.guild.id,
        });

        if (!newRr) {
          const embed = new discord.MessageEmbed()
            .setColor(errorColor)
            .setDescription("`❌` Nie znaleziono takiej reaction roli.")
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({ text: "Lotrus Bot" });

          return message.channel.send({ embeds: [embed] });
        }

        const rr = await newRr.remove();

        const userReactions = msg.reactions.cache.filter(
          (e) => e.emoji.name == em
        );

        userReactions.map((e) => e.remove());

        const embed = new discord.MessageEmbed()
          .setColor(color)
          .setDescription(`\`✅\` Pomyślnie usunięto reactionrole.`)
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
