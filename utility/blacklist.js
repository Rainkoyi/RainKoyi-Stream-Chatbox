export function isBlacklisted(id) {
  const ids = ["UCqsNc93UKdmOZeWuZ2iUD0Q", "rainkoyi"];
  if (ids.includes(id)) {
    return true;
  } else {
    return false;
  }
}
