/**
 * Utility function to generate correct image paths for static hosting
 * @param imagePath - The image path relative to the public directory
 * @returns The correct image path with base path if needed
 */
export function getImagePath(imagePath: string): string {
  const basePath = process.env.BASE_PATH || ''
  // Ensure the path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${basePath}${normalizedPath}`
}

/**
 * Utility function specifically for static images in the public/static/images directory
 * @param filename - The filename of the image
 * @returns The complete path to the image
 */
export function getStaticImagePath(filename: string): string {
  return getImagePath(`/static/images/${filename}`)
}
