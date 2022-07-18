require("dotenv").config();

module.exports = {
  database: process.env.DATABASE || "mongodb://localhost:27017/lotrus",
  token: process.env.TOKEN,
  prefix: process.env.PREFIX || ".",
  ownerId: process.env.OWNER_ID || "853738320634576958",
  color: "#fcb103",
  errorColor: "#ff4a4a",
  webhookId: "",
  webhookToken: "",
};
