import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSuccessPage from '../components/checkout/CheckoutSuccessPage.jsx';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  const handleNavigate = (page, options = {}) => {
    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'shop' || page === 'collections') {
      navigate('/collections/all');
    } else if (page === 'account' || page === 'profile') {
      navigate('/account');
    } else if (page === 'product' && options?.productHandle) {
      navigate(`/products/${options.productHandle}`);
    } else if (typeof page === 'string' && page.startsWith('/')) {
      navigate(page);
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <CheckoutSuccessPage
      onNavigate={handleNavigate}
    />
  );
}
