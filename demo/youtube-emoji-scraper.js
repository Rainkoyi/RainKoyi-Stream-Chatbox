// Get all youtube emojis from https://emojis.wiki/youtube/

// Find all table rows
const rows = document.querySelectorAll("tr");

// Create an array to store the results
const emojiData = [];

// Process each row
rows.forEach((row, index) => {
  // Get the emoji name from the button
  const nameButton = row.querySelector("button[data-copy]");
  const emojiName = nameButton
    ? nameButton.getAttribute("data-copy")
    : `emoji-${index}`;

  // Get the image URL
  const img = row.querySelector("img");
  if (img && img.src) {
    emojiData.push({
      type: "emote",
      imageUrl: img.src,
    });
  }
});

// Print all URLs in a readable format
console.log("All emoji image URLs:");
emojiData.forEach((item) => {
  console.log(`${item.name} ${item.url}`);
});

// Also print as JSON if you want to copy all data at once
console.log("\nJSON format:");
console.log(JSON.stringify(emojiData, null, 2));

// Return the array in case you want to use it for other operations
emojiData;
