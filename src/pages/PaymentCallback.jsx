import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GatewayCallbackPage from '../components/checkout/GatewayCallbackPage.jsx';

export default function PaymentCallback() {
  const { provider = 'icici' } = useParams();
  const navigate = useNavigate();

  const handleNavigate = (page, options = {}) => {
    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'checkout-success' || page === 'checkout/success') {
      navigate('/checkout/success');
    } else if (page === 'checkout') {
      navigate('/checkout');
    } else if (page === 'account' || page === 'profile') {
      navigate('/account');
    } else if (page === 'shop' || page === 'collections') {
      navigate('/collections/all');
    } else if (typeof page === 'string' && page.startsWith('/')) {
      navigate(page);
    } else {
      navigate(`/${page}`);
    }
  };

  const handlePaymentVerified = (order) => {
    try {
      sessionStorage.setItem('nilkanth_last_placed_order', JSON.stringify(order));
    } catch {}
    navigate('/checkout/success');
  };

  return (
    <GatewayCallbackPage
      provider={provider}
      onNavigate={handleNavigate}
      onPaymentVerified={handlePaymentVerified}
    />
  );
}
