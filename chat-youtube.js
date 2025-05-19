import { replaceEmoji } from "./utility/replace-emoji.js";
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
  messageElement.innerHTML = `
  <i class="fa-brands fa-youtube" style="color: #fe0606;"></i>
  <img class="profile-image" src="${profileImage}"/>
    <span class="user">${username}:</span>
    <span class="message">${replaceEmoji(message)}</span>
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

// Helper functions
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
