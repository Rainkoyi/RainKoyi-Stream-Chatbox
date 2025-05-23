// Generate a random pastel color that looks good in chat
export function generateRandomColor() {
  // Generate pastel colors by mixing with white
  const hue = Math.floor(Math.random() * 360); // Random hue
  const saturation = 70 + Math.random() * 30; // 70-100% saturation
  const lightness = 45 + Math.random() * 15; // 45-60% lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getPinkColor() {
  return "#fb79b8";
}
