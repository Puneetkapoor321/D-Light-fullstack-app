export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api`;

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${BASE_URL}${path}`;
  if (path.startsWith('uploads')) return `${BASE_URL}/${path}`;
  return path; // Fallback for public assets like /images/...
};
