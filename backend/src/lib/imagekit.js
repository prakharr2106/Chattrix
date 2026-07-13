import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });

// Check whether ImageKit is configured
function hasImageKitConfig() {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

// originalName = "My Photo (1).png"
// Result: "chat-1749300000000-My_Photo__1_.png"
// Creates a unique, safe filename for uploads
function createFileName(originalName = "upload") {
  // Replace invalid filename characters with underscores
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Prefix with timestamp to avoid duplicate names
  return `chat-${Date.now()}-${safeName}`;
}

/**
 * Upload image or video to ImageKit
 * @see https://imagekit.io/docs/api-reference/upload-file/upload-file
 */
async function uploadChatMedia(file) {
  // Generate a unique filename
  const fileName = createFileName(file.originalname);

  // Upload the file to the "/chat" folder
  const result = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName, { type: file.mimetype }),
    fileName,
    folder: "/chat",
  });

  // Return the uploaded file's URL
  return result.url;
}

export { uploadChatMedia, hasImageKitConfig };