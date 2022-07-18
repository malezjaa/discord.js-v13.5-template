const discord = require("discord.js");
const timezone = require("moment-timezone");
const moment = require("moment");
require("moment-duration-format");
const ms = require("ms");
const os = require("node:os");
const packageJson = require("../../package.json");
const { color } = require("../../config");

module.exports = {
  name: "botinfo",
  aliases: ["botinfo", "bot-info", "bot"],
  description: "Informacje o bocie.",
  category: "info",
  cooldown: 3,
  run: async (client, message, args) => {
    try {
      const duration = moment
        .duration(client.uptime)
        .format("**D [d], H [g], m [m], s [s], **");

      const embed = new discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(color)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" })
        .addField(
          "`💻` Platforma",
          `${process.platform} - ${process.arch}`,
          true
        )
        .addField("`⏰` Uptime", `${duration}`, true)
        .addField(
          "`📟` Użycie Pamięci",
          `${formatBytes(process.memoryUsage.rss())}`,
          true
        )
        .addField("`📁` Wersja node.js", `${process.version}`, true)
        .addField("`📚` Wersja discord.js", `${discord.version}`, true)
        .addField("`🤖` Wersja bota", `${packageJson.version}`, true);

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      const embed = new discord.MessageEmbed()
        .setDescription(`${e}`)
        .setColor(color);
      message.channel.send({ embeds: [embed] });
    }
  },
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
