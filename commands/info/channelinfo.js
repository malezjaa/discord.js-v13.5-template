const discord = require("discord.js");
const { prefix, color, errorColor } = require("../../config");
const timezone = require("moment-timezone");
const { readdirSync } = require("fs");
const moment = require("moment");

module.exports = {
  name: "channelinfo",
  aliases: ["channel", "channel-info"],
  description: "Informacje o kanale!",
  category: "info",
  cooldown: 2,

  run: async (client, message, args) => {
    const channel = message.mentions.channels.first() || message.channel;

    const types = {
      GUILD_TEXT: "Tekstowy",
      GUILD_PUBLIC_THREAD: "Publiczny Wątek",
      GUILD_PRIVATE_THREAD: "Prywatny Wątek",
      GUILD_NEWS: "Nowości",
      GUILD_NEWS_THREAD: "Wątek z Nowościami",
      GUILD_VOICE: "Głosowy",
      GUILD_STAGE_VOICE: "Głosowy",
    };

    const embed = new discord.MessageEmbed()
      .setColor(color)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField(`\`💬\` Nazwa`, `${channel.name}`, true)
      .addField(`\`🆔\` ID`, `${channel.id}`, true)
      .addField(
        `\`⏰\` Data Stworzenia`,
        `\`${moment(channel.createdAt).format(`DD/MM/YYYY`)}\` **-** \`${moment(
          channel.createdAt
        ).format(`hh:mm:ss`)}\`
          `,
        true
      )
      .addField(`\`📚\` Typ`, `${types[channel.type]}`, true)
      .addField(`\`📜\` Kategoria`, `${channel.parent.name}`, true)
      .setFooter({ text: "Lotrus Bot" });

    return message.channel.send({ embeds: [embed] });
  },
};
