export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api`;

/**
 * Normalizes image paths and implements cache-busting to ensure latest images load.
 */
export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "";
  
  let finalUrl = path;
  if (!path.startsWith('http')) {
    if (path.startsWith('/uploads')) {
      finalUrl = `${BASE_URL}${path}`;
    } else if (path.startsWith('uploads')) {
      finalUrl = `${BASE_URL}/${path}`;
    }
  }

  // ADDED: Cache-busting query param (unique to each timestamped filename)
  // This solves "Image Not Updating" issue by forcing browser to fetch if path changed
  return `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
};
