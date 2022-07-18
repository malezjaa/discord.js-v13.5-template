const discord = require("discord.js");
const { prefix, color, errorColor } = require("../../config");
const timezone = require("moment-timezone");
const { readdirSync } = require("fs");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  aliases: ["user", "whois", "user-info"],
  description: "Informacje o użytkowniku!",
  category: "info",
  cooldown: 2,

  run: async (client, message, args) => {
    const user = message.mentions.members.first() || message.member;

    const filteredRoles = user.roles.cache.filter(
      (role) => role.id != message.guild.id
    );
    const highestRole = filteredRoles
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())[0];

    const embed = new discord.MessageEmbed()
      .setColor(color)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField(
        `\`🧑\` Nazwa Użytkownika`,
        `${user.user.username}#${user.user.discriminator}`,
        true
      )
      .addField("`🤖` Bot", `${user.bot ? `\`✅\`` : `\`❌\``}`, true)
      .addField(`\`🚨\` Najwyższa Rola`, `${highestRole}`, true)
      .addField(
        `\`📷\` Avatar`,
        `[\`Link\`](${user.displayAvatarURL({ format: "png" })})`,
        true
      )
      .addField(
        `\`⏰\` Utworzenie konta`,
        `\`${moment(user.user.createdAt).format(
          "DD/MM/YYYY"
        )}\` **-** \`${moment(user.user.createdAt).format("hh:mm:ss")}\`
        `,
        true
      )
      .addField(
        `\`📚\` Data Dołączenia`,
        `\`${moment(user.joinedAt).format("DD/MM/YYYY")}\` **-** \`${moment(
          user.joinedAt
        ).format("hh:mm:ss")}\`
        `,
        true
      )
      .setFooter({ text: "Lotrus Bot" })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    return message.channel.send({ embeds: [embed] });
  },
};
