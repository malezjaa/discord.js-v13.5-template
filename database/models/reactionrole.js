const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    messageId: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    guildId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("ReactionRole", userSchema);

module.exports = User;
