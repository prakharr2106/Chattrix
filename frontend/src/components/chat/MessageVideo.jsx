import { isImageKitUrl, withTransform } from "../../lib/imagekit.js";

// ImageKit transformations for optimized video delivery
// (compressed and resized for chat bubbles)
const VIDEO_TRANSFORM = "q-80,w-640";
const POSTER_TRANSFORM = "q-80,w-640";

// Generate a thumbnail URL to use as the video's poster image
function buildPosterUrl(url) {
  // Skip if the URL is not hosted on ImageKit
  if (!isImageKitUrl(url)) return undefined;

  // Remove query parameters and append the thumbnail endpoint
  const [path] = url.split("?");
  return withTransform(`${path}/ik-thumbnail.jpg`, POSTER_TRANSFORM);
}

// Video component for displaying chat videos
export function MessageVideo({ src }) {
  // Apply ImageKit transformations to the video URL
  const optimizedSrc = withTransform(src, VIDEO_TRANSFORM);

  // Generate the poster (thumbnail) image
  const posterSrc = buildPosterUrl(src);

  return (
    <video
      src={optimizedSrc}
      poster={posterSrc}
      controls
      playsInline
      preload="metadata"
      className="mb-1.5 max-h-52 max-w-full rounded-lg object-contain sm:max-h-64 sm:rounded-xl"
    />
  );
}
