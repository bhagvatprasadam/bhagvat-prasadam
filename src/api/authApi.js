import { apiPost } from './apiClient.js';

/**
 * Send OTP to customer email or phone number
 */
export async function sendOtp(identifier) {
  const clean = String(identifier).trim();
  const isEmail = clean.includes('@');
  const payload = isEmail ? { email: clean.toLowerCase() } : { phone: clean };
  return await apiPost('/auth/send-otp', payload);
}

/**
 * Verify OTP and extract customer JWT token
 */
export async function verifyOtp(identifier, otp) {
  const clean = String(identifier).trim();
  const isEmail = clean.includes('@');
  const payload = isEmail
    ? { email: clean.toLowerCase(), otp: String(otp).trim() }
    : { phone: clean, otp: String(otp).trim() };

  const response = await apiPost('/auth/verify-otp', payload);

  // Extract token dynamically from potential response structures
  const token = response?.token ||
                response?.data?.token ||
                response?.jwt ||
                response?.data?.jwt ||
                response?.access_token ||
                response?.data?.access_token ||
                response?.customer_token ||
                response?.data?.customer_token;

  const customer = response?.customer ||
                   response?.data?.customer ||
                   response?.user ||
                   response?.data?.user ||
                   null;

  return {
    success: true,
    token,
    customer,
    raw: response
  };
}
