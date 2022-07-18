const User = require("../database/models/user");
const Guild = require("../database/models/guild");
const discord = require("discord.js");

module.exports = async (client, user) => {
  const guildSettings = await Guild.findOne({ id: user.guild.id });

  if (!guildSettings) {
    const newGuild = new Guild({
      id: user.guild.id,
      prefix: ".",
    });

    const savedGuild = await newGuild.save();
  }

  try {
    const channel = guildSettings.addons.goodbye.channel;
    const message =
      guildSettings.addons.goodbye.message ||
      `Witaj {userMention} na {guildName} jest nas już {serverMemberCount}`;
    const embed = guildSettings.addons.goodbye.embed;
    const status = guildSettings.addons.goodbye.enabled;
    const image = guildSettings.addons.goodbye.image;

    const msg = message
      .replaceAll("{guildName}", `${user.guild.name}`)
      .replaceAll(`{serverMemberCount}`, `${user.guild.members.cache.size}`)
      .replaceAll(
        `{userTag}`,
        `${user.user.username}#${user.user.discriminator}`
      );

    const chan = user.guild.channels.cache.get(channel);

    if (status) {
      if (channel) {
        if (embed) {
          const embed1 = new discord.MessageEmbed()
            .setColor("#24fc03")
            .setDescription(`\`😢\` Żegnaj. \n ${msg}`)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setImage(image)
            .setFooter({ text: "Lotrus Bot" });
          return chan.send({ embeds: [embed1] });
        } else {
          return chan.send({ content: msg });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};
