import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProfilePage from '../components/ProfilePage.jsx';

export default function Account() {
  const navigate = useNavigate();
  const { customer, logout, openLoginModal } = useAuth();

  const handleNavigate = (page, options = {}) => {
    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'shop' || page === 'collections') {
      navigate('/collections/all');
    } else if (page === 'product' && (options.productHandle || options.handle)) {
      navigate(`/products/${options.productHandle || options.handle}`);
    } else if (page === 'wishlist') {
      navigate('/wishlist');
    } else if (page === 'checkout') {
      navigate('/checkout');
    } else if (page.startsWith('/')) {
      navigate(page);
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <ProfilePage
      currentUser={customer}
      onLogout={logout}
      onNavigate={handleNavigate}
      onOpenAuth={openLoginModal}
    />
  );
}
