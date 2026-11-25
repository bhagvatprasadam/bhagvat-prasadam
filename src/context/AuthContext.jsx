import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthToken, setAuthToken, clearAuth, getStoredCustomer, setStoredCustomer, onAuthUnauthorized } from '../utils/auth.js';
import * as authApi from '../api/authApi.js';
import * as customerApi from '../api/customerApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [customer, setCustomer] = useState(() => getStoredCustomer());
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load customer profile, addresses, orders
  const loadCustomerData = useCallback(async (authToken) => {
    if (!authToken) {
      setCustomer(null);
      setAddresses([]);
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profile = await customerApi.getProfile();
      setCustomer(profile);
      setStoredCustomer(profile);

      // Fetch addresses & orders in parallel
      const [addrList, orderList] = await Promise.allSettled([
        customerApi.getAddresses(),
        customerApi.getOrders()
      ]);

      if (addrList.status === 'fulfilled') {
        setAddresses(addrList.value);
      }
      if (orderList.status === 'fulfilled') {
        setOrders(orderList.value);
      }
    } catch (err) {
      console.warn('Failed to load full customer data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync token changes and listen for external auth updates (e.g. AuthModal login)
  useEffect(() => {
    const currentToken = getAuthToken();
    setToken(currentToken);
    loadCustomerData(currentToken);

    const syncAuth = () => {
      const activeToken = getAuthToken();
      setToken(activeToken);
      const activeCust = getStoredCustomer();
      if (activeCust) {
        setCustomer(activeCust);
      }
      if (activeToken) {
        loadCustomerData(activeToken);
      }
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-changed', syncAuth);

    // Subscribe to 401 unauthorized notifications
    const unsubscribe = onAuthUnauthorized(() => {
      setToken(null);
      setCustomer(null);
      setAddresses([]);
      setOrders([]);
    });

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-changed', syncAuth);
      unsubscribe();
    };
  }, [loadCustomerData]);

  // Handle immediate login success from any modal or provider
  const handleLoginSuccess = useCallback(async (authToken, customerData) => {
    const validToken = authToken || getAuthToken();
    if (validToken) {
      setAuthToken(validToken);
      setToken(validToken);
    }
    if (customerData) {
      setCustomer(customerData);
      setStoredCustomer(customerData);
    }
    if (validToken) {
      await loadCustomerData(validToken);
    }
    setIsLoginModalOpen(false);
    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
  }, [loadCustomerData]);

  // Actions
  const sendOtp = async (email) => {
    return await authApi.sendOtp(email);
  };

  const verifyOtp = async (email, otp) => {
    const result = await authApi.verifyOtp(email, otp);
    if (result.token) {
      await handleLoginSuccess(result.token, result.customer);
    }
    return result;
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setCustomer(null);
    setAddresses([]);
    setOrders([]);
    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
  };

  const refreshProfile = async () => {
    const activeToken = getAuthToken();
    if (!activeToken) return null;
    setToken(activeToken);
    try {
      const profile = await customerApi.getProfile();
      if (profile) {
        setCustomer(profile);
        setStoredCustomer(profile);
      }
      return profile;
    } catch (e) {
      console.warn('Refresh profile failed:', e);
      return null;
    }
  };

  const refreshAddresses = async () => {
    if (!getAuthToken()) return [];
    try {
      const list = await customerApi.getAddresses();
      setAddresses(list);
      return list;
    } catch (e) {
      console.warn('Refresh addresses failed:', e);
      return [];
    }
  };

  const refreshOrders = async () => {
    if (!getAuthToken()) return [];
    try {
      const list = await customerApi.getOrders();
      setOrders(list);
      return list;
    } catch (e) {
      console.warn('Refresh orders failed:', e);
      return [];
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const isUserAuthenticated = Boolean((token || getAuthToken()) && (customer || getStoredCustomer() || !loading));

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        customer,
        setCustomer,
        isAuthenticated: isUserAuthenticated,
        loading,
        addresses,
        orders,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        sendOtp,
        verifyOtp,
        handleLoginSuccess,
        login: handleLoginSuccess,
        logout,
        refreshProfile,
        refreshAddresses,
        refreshOrders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
