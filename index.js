import { StreamerbotClient } from "@streamerbot/client";

// Create a new client with default options
const client = new StreamerbotClient();

// Subscription will automatically be added to client with your listener function
client.on("Twitch.ChatMessage", (data) => {
  console.log("Twitch Chat Message Received!", data);
});
