// Generate a random pastel color that looks good in chat
export function generateRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
}

export function getDarkerColor(color) {
  // Convert hex to HSL if needed
  let hsl;
  if (color.startsWith("#")) {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    hsl = [h * 360, s * 100, l * 100];
  } else if (color.startsWith("hsl")) {
    // Parse HSL string
    const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (matches) {
      hsl = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3])];
    }
  }

  if (hsl) {
    // Make color darker and less saturated
    const [h, s, l] = hsl;
    return `hsl(${h}, ${Math.max(30, s * 0.7)}%, ${Math.max(20, l * 0.8)}%)`;
  }

  // Fallback to a dark gray if color parsing fails
  return "hsl(0, 0%, 30%)";
}

export function getPinkColor() {
  return "#fb79b8";
}
