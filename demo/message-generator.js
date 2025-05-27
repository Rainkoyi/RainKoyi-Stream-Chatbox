import { loadJson } from "../utility/load-json.js";

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomColor() {
  const colors = ["#cc59f1", "#03A9F4", "#fd6ba3", "#caf159", "#57ee6c"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

function generateUsername() {
  const adjectives = [
    "red",
    "happy",
    "lucky",
    "quick",
    "bold",
    "gentle",
    "wild",
    "clever",
  ];
  const nouns = [
    "fox",
    "bear",
    "eagle",
    "wolf",
    "hawk",
    "lion",
    "owl",
    "raven",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);

  return `${adj}${noun}${num}`.toLowerCase();
}

function generateRandomMessage(wordCount) {
  const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
  ];
  const sentence = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    sentence.push(`${words[randomIndex]} `);
  }

  return sentence.join(" ");
}

// this function generates a random YouTube message with a mix of text and emojis
export async function generateYoutubeMessage(count) {
  const parts = [];
  const emojis = await loadJson("./demo/youtube-emojis.json");

  let randomBoolean;
  for (let i = 0; i < count; i++) {
    randomBoolean = Math.random() < 0.8;
    if (randomBoolean) {
      parts.push({ type: "text", text: generateRandomMessage(1) });
    } else {
      parts.push(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }
  return {
    name: generateUsername(),
    parts: parts,
    profileImage: `./demo/pfp/${getRandomInt(1, 10)}.jpg`,
  };
}

// This function generates a random Twitch message with a mix of text and emojis
export async function generateTwitchMessage(count) {
  let randomBoolean;
  // Generate a random number of parts for the message
  const parts = [];
  const emojis = await loadJson("./demo/twitch-emojis.json");

  for (let i = 0; i < count; i++) {
    randomBoolean = Math.random() < 0.8;
    if (randomBoolean) {
      parts.push({ type: "text", text: generateRandomMessage(1) });
    } else {
      parts.push(emojis[Math.floor(Math.random() * emojis.length)]);
    }
  }
  // generate a random number of badges
  const badges = [];

  const badgesList = await loadJson("./demo/twitch-badges.json");
  for (let i = 0; i < getRandomInt(0, 3); i++) {
    badges.push(badgesList[Math.floor(Math.random() * badgesList.length)]);
  }

  const randomBadge = badges[Math.floor(Math.random() * badges.length)];
  return {
    name: generateUsername(),
    color: generateRandomColor(),
    parts: parts,
    badges: badges,
    profileImage: `./demo/pfp/${getRandomInt(1, 10)}.jpg`,
  };
}

// Usage example:
// const randomText = generateRandomMessage(5);
// generateYoutubeMessage(getRandomInt(9, 15)).then((result) =>
//   console.log(result)
// );
