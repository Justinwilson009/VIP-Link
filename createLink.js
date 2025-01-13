require("dotenv").config();

function createLink(bot, msg, chatID, groupId, groupName) {
  const chatId = chatID;
  const expiredDate = Math.floor(Date.now() / 1000) + 5 * 60; // 5 minutes
  var vipID = groupId;
  var vipName = groupName;

  if (
    msg.chat.username == "vvipgirls_admin" ||
    chatId == "7536353757" ||
    process.env.ADMIN_NAME
  ) {
    bot
      .createChatInviteLink(vipID, {
        name: `${groupName} created by ${
          msg.chat.username || msg.chat.first_name
        }`,
        expire_date: expiredDate,
        member_limit: 1,
      })
      .then((groupLink) => {
        bot.sendMessage(
          chatId,
          `🔗 Here's your single-use invite link for ***${vipName}*** \n\n ${groupLink.invite_link}`,
          { parse_mode: "Markdown", disable_web_page_preview: true }
        );
      });
  } else {
    bot.sendMessage(chatId, "You are not authorized to use this command.");
  }
}

module.exports = { createLink };
