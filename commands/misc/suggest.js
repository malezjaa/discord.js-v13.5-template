const discord = require("discord.js");
const timezone = require("moment-timezone");
const { color, errorColor } = require("../../config");
const Guild = require("../../database/models/guild");
const { MessageEmbed, WebhookClient } = require("discord.js");
const { webhookId, webhookToken } = require("../../config");

module.exports = {
  name: "suggest",
  aliases: [],
  description: "Wysyłanie propozycji.",
  category: "misc",
  cooldown: 2,

  run: async (client, message, args) => {
    try {
      const guild = await Guild.findOne({ id: message.guild.id });
      const msg = args.slice(0).join(" ");
      let webhookMessage;

      if (!guild) {
        const newGuild = new Guild({
          id: message.guild.id,
        });

        const savedGuild = await newGuild.save();
      }

      if (!guild.addons.suggest) {
        guild.addons.suggest = {};

        await guild.save();
      }

      const channel = message.guild.channels.cache.get(
        guild.addons.suggest.channel
      );

      if (!channel) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(
            `\`❌\` Nie znaleziono kanału, spróbuj ustawić go ponownie.`
          )
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });
        return message.channel.send({ embeds: [embed] });
      }

      const webhookClient = new WebhookClient({
        id: guild?.addons.suggest.webhookId,
        token: guild?.addons.suggest.webhookToken,
      });

      const webhooks = await channel.fetchWebhooks();
      const webhook = webhooks.find(
        (wh) => wh.token == guild?.addons.suggest.webhookToken
      );

      if (!webhook) {
        await channel
          .createWebhook("Lotrus Propozycje", {
            avatar:
              "https://yt3.ggpht.com/CMk0BVChJCEw6NMkA5YcTtce2BQnb_V9DCfIYJ3JM8OfeEPsYCaj8W0p5KYjfMcyk1Hp6PNGoA=s88-c-k-c0x00ffffff-no-rj",
          })
          .then(async (webhook) => {
            guild.addons.suggest.webhookToken = webhook.token;
            guild.addons.suggest.webhookId = webhook.id;
            guild.markModified("addons.suggest");
            await guild.save();
          })
          .catch(console.error);
      }

      if (!msg) {
        const embed = new discord.MessageEmbed()
          .setColor(errorColor)
          .setDescription(`\`❌\` Podaj propozycje do wysłania.`)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: "Lotrus Bot" });
        return message.channel.send({ embeds: [embed] });
      }

      const embed = new MessageEmbed()
        .setColor(color)
        .setDescription(
          `**Propozycja użytkownika: <@${message.author.id}>** \n\`💬\` ${msg}`
        )
        .setFooter({ text: "Lotrus Bot" });

      webhookMessage = webhookClient
        .send({
          username: message.author.username,
          avatarURL: message.author.displayAvatarURL({ dynamic: true }),
          embeds: [embed],
        })
        .then(async (res) => {
          console.log(res.id);
          channel.messages.fetch(res.id).then(async (message) => {
            await message.react("✅");
            await message.react("➖");
            await message.react("❌");
          });
        });
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
