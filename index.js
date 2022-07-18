const discord = require("discord.js");
const { token } = require("./config");

require("./database/mongoose");

const client = new discord.Client({
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  intents: 32767,
  allowedMentions: {
    parse: ["users"],
    repliedUser: true,
  },
  cacheWithLimits: {
    MessageManager: {
      sweepInterval: 300,
      sweepFilter: discord.Sweepers.filterByLifetime({
        lifetime: 60,
        getComparisonTimestamp: (m) => m.editedTimestamp ?? m.createdTimestamp,
      }),
    },
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const discordModals = require("discord-modals");
discordModals(client);

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.cooldowns = new discord.Collection();
client.logger = require("./utils/logger");

["commands", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.on("error", (error) => client.logger.log(error, "error"));
client.on("warn", (info) => client.logger.log(info, "warn"));

process.on("unhandledRejection", (error) =>
  client.logger.log("UNHANDLED_REJECTION\n" + error, "error")
);

process.on("uncaughtException", (error) => {
  client.logger.log("UNCAUGHT_EXCEPTION\n" + error, "error");
  client.logger.log("Uncaught Exception is detected, restarting...", "info");
  process.exit(1);
});

client.login(token).catch(() => {
  client.logger.log("Invaid TOKEN!", "warn");
});
