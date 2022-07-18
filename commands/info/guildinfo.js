const discord = require("discord.js");
const { prefix, color, errorColor } = require("../../config");
const timezone = require("moment-timezone");
const { readdirSync } = require("fs");
const moment = require("moment");

module.exports = {
  name: "guildinfo",
  aliases: [
    "guild",
    "guild-info",
    "server",
    "serwer",
    "server-info",
    "serverinfo",
    "serwer-info",
  ],
  description: "Informacje o serwerze!",
  category: "info",
  cooldown: 2,

  run: async (client, message, args) => {
    const guild = message.guild;

    const filteredRoles = guild.roles.cache.filter(
      (role) => role.id != message.guild.id
    );
    const highestRole = filteredRoles
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())[0];

    const members = guild.members.cache.filter((user) => !user.user.bot).size;
    const bots = guild.members.cache.filter((user) => user.user.bot).size;

    const voiceChannels = guild.channels.cache.filter(
      (channel) => channel.type == "GUILD_VOICE"
    ).size;
    const textChannels = guild.channels.cache.filter(
      (channel) => channel.type == "GUILD_TEXT"
    ).size;

    const embed = new discord.MessageEmbed()
      .setColor(color)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField(`\`🏰\` Nazwa`, `${guild.name}`, true)
      .addField(`\`🆔\` ID`, `${guild.id}`, true)
      .addField(`\`👑\` Właściciel`, `<@${guild.ownerId}>`, true)
      .addField(`\`🚨\` Najwyższa Rola`, `${highestRole}`, true)
      .addField(
        `\`📷\` Avatar`,
        `[\`Link\`](${guild.iconURL({ format: `png` })})`,
        true
      )
      .addField(`\`😀\` Wszyscy użytkownicy`, `${guild.memberCount}`, true)
      .addField(`\`🤖\` Boty`, `${bots}`, true)
      .addField(`\`👤\` Użytkownicy`, `${members}`, true)
      .addField(
        `\`⏰\` Data Stworzenia`,
        `\`${moment(guild.createdAt).format(`DD/MM/YYYY`)}\` **-** \`${moment(
          guild.createdAt
        ).format(`hh:mm:ss`)}\`
          `,
        true
      )
      .addField(`\`👁‍🗨\` Kanały`, `${guild.channels.cache.size}`, true)
      .addField(`\`🔈\` Kanały głosowe`, `${voiceChannels}`, true)
      .addField(`\`💬\` Kanały tekstowe`, `${textChannels}`, true)
      .setFooter({ text: "Lotrus Bot" })
      .setThumbnail(guild.iconURL({ dynamic: true }));

    return message.channel.send({ embeds: [embed] });
  },
};
