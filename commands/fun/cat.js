const discord = require("discord.js");
const { MessageAttachment } = require("discord.js");
const { prefix, color, errorColor } = require("../../config");
const timezone = require("moment-timezone");
const { readdirSync } = require("fs");
const axios = require("axios");
let fs = require("fs");

module.exports = {
  name: "cat",
  description: "Wysyła zdjęcie kota.",
  category: "fun",
  cooldown: 2,

  run: async (client, message, args) => {
    const response = await axios.get("https://some-random-api.ml/animal/cat");

    const embed = new discord.MessageEmbed()
      .setColor(color)
      .setDescription(`\`😺\` Kot`)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({ text: "Lotrus Bot" })
      .setImage(response.data.image);

    return message.channel.send({
      embeds: [embed],
    });
  },
};
