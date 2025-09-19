// utils/slugify.js
module.exports = function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")        // spaces → dashes
    .replace(/[^\w\-]+/g, "")    // remove special chars
    .replace(/\-\-+/g, "-")      // multiple dashes → one
    .replace(/^-+/, "")          // trim dash at start
    .replace(/-+$/, "");         // trim dash at end
};
