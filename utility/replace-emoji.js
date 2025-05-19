// utility/replace-emoji.js
export function replaceEmoji(parts) {
  return parts
    .map((part) => {
      if (part.type === "emote") {
        return `<img src="${part.imageUrl}" class="emoji" alt="emoji">`;
      } else {
        return part.text;
      }
    })
    .join("");
}
