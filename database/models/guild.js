const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuildSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    modActions: [
      {
        type: Array,
      },
    ],
    prefix: {
      type: String,
      required: true,
      default: ".",
    },
    addons: {
      type: Object,
      default: {
        welcome: {
          enabled: false,
          channel: null,
          message: null,
          image: "",
          embed: false,
        },
        goodbye: {
          enabled: false,
          channel: null,
          message: null,
          image: "",
          embed: false,
        },
        suggest: {
          channel: null,
          enabled: false,
          webhookToken: null,
          webhookId: null,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Guild = mongoose.model("Guild", GuildSchema);

module.exports = Guild;
