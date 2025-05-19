import { replaceEmoji } from "./utility/replace-emoji.js";

function extractTwitchMessageData(data) {
  // Extract user data
  const timestamp = new Date(data.timeStamp);
  const user = {
    id: data.data.user.login,
    name: data.data.user.name,
    badges: data.data.user.badges,
    color: data.data.user.color,
    subscribed: data.data.user.subscribed,
    url: "https://www.twitch.tv/" + data.data.user.login,
  };

  return {
    platform: "Twitch",
    timestamp: timestamp,
    user,
    parts: data.data.parts,
    rawMessage: data.data.text, // Original unparsed message
  };
}
function addMessageToChatTwitch(username, message, badges) {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = "message-container";

  // Add badges
  let badgesHTML = "";
  for (const badge of badges) {
    badgesHTML += `<img class="badge" src="${badge.imageUrl}" title="${badge.name}" />`;
  }

  // Build message HTML
  messageElement.innerHTML = `
  <i class="fa-brands fa-twitch" style="color: #9211e8;"></i>
  ${badgesHTML}
  <span class="user">${username}:</span>
  <span class="message">${replaceEmoji(message)}</span>
  `;

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

client.on("Twitch.ChatMessage", (data) => {
  console.log("Twitch Chat Message Received!", data);
  const extractedData = extractTwitchMessageData(data);
  console.log("Extracted Twitch Data:", extractedData);
  addMessageToChatTwitch(
    extractedData.user.name,
    extractedData.parts,
    extractedData.user.badges
  );
});
