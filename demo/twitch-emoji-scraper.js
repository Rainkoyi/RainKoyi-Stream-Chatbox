// get emojis from https://www.twitchmetrics.net/emotes
// Find all emoji containers
const emojiContainers = document.querySelectorAll("div.py-4.text-center");

// Create the result array
const emoteList = [];

// Process each container
emojiContainers.forEach((container) => {
  // Find the image element
  const img = container.querySelector("img.img-fluid");

  // Find the name element (assuming it's in the <samp> tag)
  const nameElement = container.querySelector("samp");

  if (img && img.src) {
    emoteList.push({
      type: "emote",
      imageUrl: img.src,
      // Adding name as well since it might be useful
      name: nameElement ? nameElement.textContent.trim() : null,
    });
  }
});

// Convert to JSON
const jsonOutput = JSON.stringify(emoteList, null, 2);

// Print to console
console.log(jsonOutput);

// Copy to clipboard automatically
copy(jsonOutput);
console.log("JSON copied to clipboard!");

// Return the array
emoteList;
