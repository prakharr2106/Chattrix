// Chat media is stored on ImageKit, so we optimize delivery by applying
// URL transformations instead of loading the original full-size files.
// https://imagekit.io/docs/image-transformation

// Check if the given URL belongs to ImageKit
export function isImageKitUrl(url) {
  return typeof url === "string" && url.includes("ik.imagekit.io");
}

// Add an ImageKit transformation to the URL (leave other URLs unchanged)
export function withTransform(url, transform) {
  // Return the original URL if it is not an ImageKit URL
  if (!isImageKitUrl(url)) return url;

  // Separate the URL path and existing query parameters
  const [path, query = ""] = url.split("?");

  // Parse the query parameters
  const params = new URLSearchParams(query);

  // Add or replace the ImageKit transformation
  params.set("tr", transform);

  // Rebuild and return the transformed URL
  return `${path}?${params.toString()}`;
}
