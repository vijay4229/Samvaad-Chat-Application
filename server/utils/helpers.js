// server/utils/helpers.js

// This is the server-side version of the helper function
export const getFilenameFromUrl = (url) => {
  try {
    const path = new URL(url).pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return decodeURIComponent(filename);
  } catch (error) {
    return "file"; // Fallback name
  }
};