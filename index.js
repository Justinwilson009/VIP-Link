require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { createLink, createMultipleLinks } = require("./createLink");
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is running!");
});

const vipGroupID = [
  {
    name: "VIP Group",
    id: process.env.VIP_GROUP,
  },
  {
    name: "OF KH",
    id: process.env.OF_GROUP,
  },
  {
    name: "Thary",
    id: process.env.THARY_GROUP,
  },
];

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `Hello ${chatId}`;
  bot.sendMessage(chatId, message, {
    reply_markup: {
      keyboard: [
        ["👑 VIP", "💎 OF KH", "😩 Thary OF"],
        ["🔥 VIP + OF KH", "💯 All Groups"],
      ],
      resize_keyboard: true,
    },
  });
});

bot.onText("👑 VIP", (msg) => {
  const chatId = msg.chat.id;
  const groupID = vipGroupID[0].id;
  const groupName = vipGroupID[0].name;
  createLink(bot, msg, chatId, groupID, groupName);
});

bot.onText("💎 OF KH", (msg) => {
  const chatId = msg.chat.id;
  const groupID = vipGroupID[1].id;
  const groupName = vipGroupID[1].name;
  createLink(bot, msg, chatId, groupID, groupName);
});
bot.onText("😩 Thary OF", (msg) => {
  const chatId = msg.chat.id;
  const groupID = vipGroupID[2].id;
  const groupName = vipGroupID[2].name;
  createLink(bot, msg, chatId, groupID, groupName);
});

bot.on("message", (msg) => {
  if (msg.text === "🔥 VIP + OF KH") {
    const chatId = msg.chat.id;
    const selectedGroups = [vipGroupID[0], vipGroupID[1]];
    console.log("Selected groups:", selectedGroups);
    createMultipleLinks(bot, msg, chatId, selectedGroups);
  }
});

bot.onText("💯 All Groups", (msg) => {
  const chatId = msg.chat.id;
  createMultipleLinks(bot, msg, chatId, vipGroupID);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server is running on port ${PORT}`);
});
