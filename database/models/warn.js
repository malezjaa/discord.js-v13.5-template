const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const warnSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    moderator: {
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

const Warn = mongoose.model("Warn", warnSchema);

module.exports = Warn;
