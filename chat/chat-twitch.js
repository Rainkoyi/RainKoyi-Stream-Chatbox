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
function addMessageToChatTwitch(data) {
  // Create message element
  const messageElement = document.createElement("div");
  messageElement.className = "message";

  // Add badges
  let badgesHTML = "";
  if (data.data.user.badges) {
    badgesHTML = data.data.user.badges
      .map(
        (badge) =>
          `<img src="${badge.imageUrl}" class="badge" alt="${badge.name}" title="${badge.name}">`
      )
      .join("");
  }

  // Set username color
  const usernameStyle = data.data.user.color
    ? `style="color: ${data.data.user.color}"`
    : "";

  // Build message HTML
  messageElement.innerHTML = `
  <div>
  ${badgesHTML}
  <span class="user" ${usernameStyle}>${
    data.data.user.displayName || data.data.user.name
  }</span>:
  <span>${data.data.text}</span>
  </div>
  `;

  // Add to chat container
  chatContainer.appendChild(messageElement);

  // Auto-scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

client.on("Twitch.ChatMessage", (data) => {
  console.log("Twitch Chat Message Received!", data);
  addMessageToChatTwitch(data);
});
