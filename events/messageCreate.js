const discord = require("discord.js");
const { ownerId, errorColor } = require("../config");
const Guild = require("../database/models/guild");
const User = require("../database/models/user");

module.exports = async (client, message) => {
  const guild = await Guild.findOne({ id: message.guild.id });

  if (!guild) {
    const newGuild = new Guild({
      id: message.guild.id,
      warns: [],
      prefix: newPrefix,
    });

    const savedGuild = await newGuild.save();
  }

  let prefix = guild.prefix ? guild.prefix : ".";

  let tag = new discord.MessageEmbed()
    .setColor(`#fcb103`)
    .setDescription(
      `👋 | Hey **${message.author.tag}**, My prefix for this guild is: \`${prefix}\``
    );
  if (
    message.content === `<@!${client.user.id}>` ||
    message.content === `<@${client.user.id}>`
  ) {
    return message.channel.send({ embeds: [tag] });
  }

  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    message.channel.type === "dm"
  ) {
    return;
  }

  if (!message.content.startsWith(prefix)) return;

  const isExists = await User.findOne({ id: message.author.id });

  if (!isExists) {
    const newUser = new User({
      id: message.author.id,
      warns: [],
      userId: message.author.id,
    });

    const savedUser = await newUser.save();
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  const cmdName = args.shift().toLowerCase();

  const cmd =
    client.commands.get(cmdName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName));

  if (!cmd) return;

  if (cmd.guildOnly && !guild) {
    const embed = new discord.MessageEmbed()
      .setColor(errorColor)
      .setDescription(`\`❌\` Nie mogę użyć tej komendy w środku DMa`)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({ text: "Lotrus Bot" });

    return message.channel.send({ embeds: [embed] });
  }

  if (cmd.ownerOnly) {
    if (author.id !== ownerId) {
      const embed = new discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription(`\`❌\` Tylko właściciel bota może użyć tej komendy.`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
    }
  }

  if (cmd.memberpermissions) {
    if (!message.member.permissions.has(cmd.memberpermissions)) {
      const embed = new discord.MessageEmbed()
        .setColor(errorColor)
        .setDescription(`\`❌\` Nie masz wystarczająco uprawnień.`)
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: "Lotrus Bot" });

      return message.channel.send({ embeds: [embed] });
    }
  }

  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new discord.Collection());
  }

  let now = Date.now();
  let timeStamp = client.cooldowns.get(cmd.name) || new Collection();
  let cool = cmd.cooldown || 5;
  let userCool = timeStamp.get(message.author.id) || 0;
  let estimated = userCool + cool * 1000 - now;

  if (userCool && estimated > 0) {
    const embed = new discord.MessageEmbed()
      .setColor(errorColor)
      .setDescription(
        `\`❌\` Proszę odczekać ${(
          estimated / 1000
        ).toFixed()} sekund przed ponownym użyciem komendy: ${cmd.name}`
      )
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({ text: "Lotrus Bot" });

    return await message.reply({ embeds: [embed] }).then((message) => {
      setTimeout(() => message.delete().catch(() => null), estimated);
    });
  }

  timeStamp.set(message.author.id, now);
  client.cooldowns.set(cmd.name, timeStamp);
  try {
    cmd.run(client, message, args);
  } catch (error) {
    client.logger.log(error, "error");
    const embed = new discord.MessageEmbed()
      .setColor(errorColor)
      .setDescription(`\`❌\` Wystąpił błąd podczas wykonywania komendy.`)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({ text: "Lotrus Bot" });

    return message.channel.send({ embeds: [embed] });
  } finally {
    client.logger.log(
      `> ID : ${message.author.id} | User : ${message.author.tag} | cmd | ${cmd.name}`,
      "info"
    );
  }
};
