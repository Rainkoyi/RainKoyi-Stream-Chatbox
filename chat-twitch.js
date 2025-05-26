import { replaceEmoji } from "./utility/replace-emoji.js";
import { loadJson } from "./utility/load-json.js";
import { getTwitchColor, getPastelColor } from "./utility/generate-color.js";
import {
  generateTwitchMessage,
  getRandomInt,
} from "./demo/message-generator.js";

function extractTwitchMessageData(data) {
  // Extract user data
  const timestamp = new Date(data.timeStamp);
  const color = data.data.user.color ? data.data.user.color : getTwitchColor();
  // const color = getTwitchColor();

  const user = {
    id: data.data.user.login,
    name: data.data.user.name,
    badges: data.data.user.badges,
    color: color,
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
function addMessageToChatTwitch(username, message, badges, color) {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = "message-container";
  messageElement.style.setProperty("--message-color", color);
  messageElement.style.setProperty("--bg-color", getPastelColor(color));

  // Add badges
  let badgesHTML = "";
  for (const badge of badges) {
    badgesHTML += `<img class="badge" src="${badge.imageUrl}" title="${badge.name}" />`;
  }

  // Build message HTML with separate bubbles for username and message
  messageElement.innerHTML = `
  <div class="username-bubble" style="border-color: ${color};">
  <i class="fa-brands fa-twitch"></i>
  <span class="user">${username}</span>
  ${badgesHTML}
  </div>
  <div class="message-content">
 <div class="message-bubble" style="border-color: ${color};">
  <span class="message">${replaceEmoji(message)}</span>
  </div>
  </div>
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
    extractedData.user.badges,
    extractedData.user.color
  );
});

// async function testChatTwitch() {
//   const messages = await loadJson("reference/twitch-messages.json");
//   for (const message of messages) {
//     const extractedData = extractTwitchMessageData(message);
//     addMessageToChatTwitch(
//       extractedData.user.name,
//       extractedData.parts,
//       extractedData.user.badges,
//       extractedData.user.color
//     );
//   }
// }

async function testChatTwitch() {
  const data = await generateTwitchMessage(10);
  console.log("Generated Twitch Message:", data);
  addMessageToChatTwitch(data.name, data.parts, data.badges, data.color);
}
testChatTwitch();
