require("dotenv").config();

function createLink(bot, msg, chatID, groupId, groupName) {
  const chatId = chatID;
  const expiredDate = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes
  const vipID = groupId;
  const vipName = groupName;

  // Define the allowed admins
  const allowedAdmins = ["7536353757", process.env.ADMIN_NAME];

  // Check if the user is an admin
  if (
    allowedAdmins.includes(msg.chat.username) ||
    allowedAdmins.includes(msg.chat.id.toString())
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
          `🔗 Here's your single-use invite link for *${vipName}*\n\n${groupLink.invite_link}`,
          { parse_mode: "Markdown", disable_web_page_preview: true }
        );
      })
      .catch((error) => {
        console.error("Error creating single link:", error);
        bot.sendMessage(chatId, "❌ Error generating link. Please try again.");
      });
  } else {
    bot.sendMessage(chatId, "⛔ You are not authorized to generate links.");
  }
}

async function createMultipleLinks(bot, msg, chatID, groups) {
  console.log("createMultipleLinks called with:", groups.length, "groups");

  const chatId = chatID;
  const expiredDate = Math.floor(Date.now() / 1000) + 10 * 60; // 10 minutes

  // Define the allowed admins
  const allowedAdmins = ["7536353757", process.env.ADMIN_NAME];

  console.log(
    "Checking authorization for user:",
    msg.chat.username || msg.chat.id
  );

  // Check if the user is an admin
  if (
    allowedAdmins.includes(msg.chat.username) ||
    allowedAdmins.includes(msg.chat.id.toString())
  ) {
    console.log("User authorized, generating links...");
    bot.sendMessage(msg.chat.id, "Please wait, generating links...");

    try {
      // Create links one by one with delay to avoid rate limits
      const groupLinks = [];

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        console.log(`Creating link for group ${i}:`, group.name);

        try {
          const link = await bot.createChatInviteLink(group.id, {
            name: `${group.name} created by ${
              msg.chat.username || msg.chat.first_name
            }`,
            expire_date: expiredDate,
            member_limit: 1,
          });

          groupLinks.push({ group, link });

          // Add delay between requests
          if (i < groups.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } catch (linkError) {
          console.error(`Error creating link for ${group.name}:`, linkError);
          // Continue with other groups
        }
      }

      console.log("Links created successfully:", groupLinks.length);

      // Send links without problematic markdown
      let message = "🔗 Your VIP Links:\n\n";
      groupLinks.forEach(({ group, link }) => {
        message += `${group.name}:\n${link.invite_link}\n\n`;
      });

      await bot.sendMessage(chatId, message, {
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error creating multiple links:", error);
      bot.sendMessage(chatId, "❌ Error generating links. Please try again.");
    }
  } else {
    console.log("User not authorized");
    bot.sendMessage(chatId, "⛔ You are not authorized to generate links.");
  }
}

module.exports = { createLink, createMultipleLinks };
