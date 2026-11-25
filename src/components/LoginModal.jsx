import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AuthModal from './AuthModal.jsx';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, setCustomer, setToken, refreshProfile, handleLoginSuccess } = useAuth();

  return (
    <AuthModal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      onLoginSuccess={(loggedCustomer, authToken) => {
        if (handleLoginSuccess) {
          handleLoginSuccess(authToken, loggedCustomer);
        } else {
          if (authToken && setToken) {
            setToken(authToken);
          }
          if (setCustomer && loggedCustomer) {
            setCustomer(loggedCustomer);
          }
          if (refreshProfile) {
            refreshProfile();
          }
        }
      }}
    />
  );
}
