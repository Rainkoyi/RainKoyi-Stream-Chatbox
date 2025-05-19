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

  return {
    platform: "YouTube",
    timestamp: timestamp,
    user,
    stream,
    parts: data.data.parts,
    rawMessage: data.data.message,
  };
}

function addMessageToChat(username, message, profileImage) {
  const messageElement = document.createElement("div");
  messageElement.className = "message-container";
  messageElement.innerHTML = `
  <i class="fa-brands fa-youtube" style="color: #fe0606;"></i>
  <img class="profile-image" src="${profileImage}"/>
    <span class="user">${username}:</span>
    <span class="message">${message}</span>
  `;

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

client.on("YouTube.Message", (data) => {
  console.log("YouTube Message Received!", data);
  const extractedData = extractYouTubeMessageData(data);
  console.log("Extracted Data:", extractedData);
  addMessageToChat(
    extractedData.user.name,
    extractedData.rawMessage,
    extractedData.user.profileImage
  );
});

// Helper functions
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
