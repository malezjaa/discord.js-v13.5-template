const ReactionRole = require("../database/models/reactionrole");
const discord = require("discord.js");
const { color } = require("../config");

module.exports = async (client, reaction, user) => {
  if (user.bot) return;

  const { message, emoji } = reaction;
  const member = message.guild.members.cache.get(user.id);

  if (reaction.partial) {
    try {
      const dbEmoji = await ReactionRole.findOne({
        guildId: message.guild.id,
        emoji: emoji,
        messageId: message.id,
        channelId: message.channel.id,
      });

      if (!dbEmoji) return;

      const role = message.guild.roles.cache.get(dbEmoji.roleId);

      if (!role) return;

      member.roles.add(role);

      const embed = new discord.MessageEmbed()
        .setColor(color)
        .setDescription(`\`✅\` Pomyślnie dodano rangę: ${role.name}`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });
      member.send({ embeds: [embed] }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.error("Something went wrong.", error);
      return;
    }
  }
};
