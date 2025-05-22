import { replaceEmoji } from "./utility/replace-emoji.js";
import { loadJson } from "./utility/load-json.js";
import { generateRandomColor } from "./utility/generate-color.js";

/**
 * Extracts and organizes all relevant data from YouTube message
 */
function extractYouTubeMessageData(data) {
  // Basic message info
  const timestamp = new Date(data.timeStamp);
  const user = {
    id: data.data.user.id,
    name: data.data.user.name,
    profileImage: data.data.user.profileImageUrl,
    isOwner: data.data.user.isOwner,
    isModerator: data.data.user.isModerator,
    url: data.data.user.url,
  };

  const stream = {
    title: data.data.broadcast.title,
    id: data.data.broadcast.id,
  };

  // Parse message parts
  const parts = data.data.parts.map((part) => {
    if (part.emoji) {
      return { type: "emote", imageUrl: part.image };
    } else {
      return { type: "text", text: part.text };
    }
  });

  return {
    platform: "YouTube",
    timestamp: timestamp,
    rawMessage: data.data.message,
    user,
    stream,
    parts,
  };
}

function addMessageToChatYoutube(username, message, profileImage) {
  const messageElement = document.createElement("div");
  messageElement.className = "message-container";
  const color = generateRandomColor();

  messageElement.innerHTML = `
    <div class="youtube-message-wrapper">
      <img class="profile-image" src="${profileImage}"/>
      <div class="youtube-content">
        <div class="username-bubble">
          <i class="fa-brands fa-youtube" style="color: #fe0606;"></i>
          <span class="user">${username}</span>
        </div>
        <div class="message-content">
          <div class="message-bubble" style="background: #FFFFFF">
            <span class="message">${replaceEmoji(message)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

client.on("YouTube.Message", (data) => {
  console.log("YouTube Message Received!", data);
  const extractedData = extractYouTubeMessageData(data);
  console.log("Extracted YouTube Data:", extractedData);
  addMessageToChatYoutube(
    extractedData.user.name,
    extractedData.parts,
    extractedData.user.profileImage
  );
});

async function testChatYoutube() {
  const messages = await loadJson("reference/youtube-messages.json");
  for (const message of messages) {
    const extractedData = extractYouTubeMessageData(message);
    addMessageToChatYoutube(
      extractedData.user.name,
      extractedData.parts,
      extractedData.user.profileImage
    );
  }
}
testChatYoutube();
