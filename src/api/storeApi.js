import { apiGet } from './apiClient.js';

/**
 * Fetch dynamic store information and settings
 */
export async function getStoreInfo() {
  const response = await apiGet('/info');
  return response.data || response;
}
