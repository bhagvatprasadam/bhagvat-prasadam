import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiRequest, API_BASE_URL } from './apiClient.js';

/**
 * Create customer account (used for guest checkout or quick signup)
 */
export async function createCustomer(payload) {
  // Base endpoint for create customer is /backend/api/customers (without /shop)
  const customersEndpoint = API_BASE_URL.replace(/\/shop$/, '') + '/customers';
  return await apiRequest(customersEndpoint, {
    method: 'POST',
    body: payload,
    isAbsoluteUrl: true
  });
}

/**
 * Fetch authenticated customer profile
 */
export async function getProfile() {
  const response = await apiGet('/customer/me');
  return response.data || response;
}

/**
 * Update customer profile
 */
export async function updateProfile(data) {
  const response = await apiPut('/customer/profile', data);
  return response.data || response;
}

/**
 * Fetch customer orders
 */
export async function getOrders() {
  try {
    const response = await apiGet('/customer/orders');
    return Array.isArray(response.data) ? response.data : (response.data?.orders || []);
  } catch (err) {
    console.warn('Customer orders fetch error:', err.message);
    return [];
  }
}

/**
 * Fetch single order by order ID
 */
export async function getOrderById(orderId) {
  if (!orderId) return null;
  try {
    const response = await apiGet(`/orders/${orderId}`);
    return response.data || response;
  } catch (err) {
    console.warn('Order fetch by ID notice:', err.message);
    return null;
  }
}

/**
 * Fetch customer saved addresses
 */
export async function getAddresses() {
  const response = await apiGet('/customer/addresses');
  return Array.isArray(response.data) ? response.data : (response.data?.addresses || []);
}

/**
 * Add a new customer address
 */
export async function createAddress(addressData) {
  const response = await apiPost('/customer/addresses', addressData);
  return response.data || response;
}

/**
 * Update an existing customer address
 */
export async function updateAddress(id, addressData) {
  const response = await apiPut(`/customer/addresses/${id}`, addressData);
  return response.data || response;
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(id) {
  const response = await apiPatch(`/customer/addresses/${id}/default`);
  return response.data || response;
}

/**
 * Delete a customer address
 */
export async function deleteAddress(id) {
  const response = await apiDelete(`/customer/addresses/${id}`);
  return response.data || response;
}
