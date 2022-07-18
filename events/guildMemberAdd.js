const User = require("../database/models/user");
const Guild = require("../database/models/guild");
const discord = require("discord.js");

module.exports = async (client, user) => {
  try {
    const isExists = await User.findOne({ id: user.id });

    if (!isExists) {
      const newUser = new User({ id: user.id, warns: [], userId: user.id });

      const savedUser = await newUser.save();
    }

    const guildSettings = await Guild.findOne({ id: user.guild.id });

    if (!guildSettings) {
      const newGuild = new Guild({
        id: user.guild.id,
        prefix: ".",
      });

      const savedGuild = await newGuild.save();
    }

    const channel = guildSettings.addons.welcome.channel;
    const message =
      guildSettings.addons.welcome.message ||
      `Witaj {userMention} na {guildName} jest nas już {serverMemberCount}`;
    const embed = guildSettings.addons.welcome.embed;
    const status = guildSettings.addons.welcome.enabled;
    const image = guildSettings.addons.welcome.image;

    const msg = message
      .replaceAll("{userMention}", `<@${user.id}>`)
      .replaceAll("{guildName}", `${user.guild.name}`)
      .replaceAll(`{serverMemberCount}`, `${user.guild.members.cache.size}`)
      .replaceAll(`{userTag}`, `${user.username}${user.tag}`);

    const chan = user.guild.channels.cache.get(channel);

    if (status) {
      if (channel) {
        if (embed) {
          const embed1 = new discord.MessageEmbed()
            .setColor("#24fc03")
            .setDescription(`\`👏\` Witaj. \n ${msg}`)
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
