// Get all badge containers
const badgeItems = document.querySelectorAll("li.grid__item");

const badgeList = [];

badgeItems.forEach((item) => {
  // Get the <a> tag containing both image and name
  const anchor = item.querySelector("a.item.item--full");

  if (anchor) {
    // Correct selectors for the elements inside the <a> tag
    const img = anchor.querySelector("img");
    const name = anchor.querySelector("span");

    if (img && img.src && name) {
      badgeList.push({
        imageUrl: img.src,
        name: name.textContent.trim(),
      });
    }
  }
});

console.log(badgeList);
