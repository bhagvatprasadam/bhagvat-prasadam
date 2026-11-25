import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CheckoutPage from '../components/checkout/CheckoutPage.jsx';

export default function Checkout() {
  const navigate = useNavigate();
  const { customer, openLoginModal } = useAuth();

  const handleNavigate = (page, options = {}) => {
    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'checkout-success' || page === 'checkout/success') {
      navigate('/checkout/success');
    } else if (page === 'account' || page === 'profile') {
      navigate('/account');
    } else if (page === 'shop' || page === 'collections') {
      navigate('/collections/all');
    } else if (page === 'product' && options?.productHandle) {
      navigate(`/products/${options.productHandle}`);
    } else if (typeof page === 'string' && page.startsWith('/')) {
      navigate(page);
    } else {
      navigate(`/${page}`);
    }
  };

  const handleOrderCompleted = (order) => {
    try {
      sessionStorage.setItem('nilkanth_last_placed_order', JSON.stringify(order));
    } catch {}
    navigate('/checkout/success');
  };

  return (
    <CheckoutPage
      currentUser={customer}
      onNavigate={handleNavigate}
      onOpenAuthModal={openLoginModal}
      onOrderCompleted={handleOrderCompleted}
    />
  );
}
