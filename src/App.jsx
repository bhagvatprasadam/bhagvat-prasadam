import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { trackPageView } from './services/analytics';
import MainLayout from './layouts/MainLayout';
import LoginModal from './components/LoginModal';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import PaymentCallback from './pages/PaymentCallback';
import Account from './pages/Account';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import OurGauDham from './pages/OurGauDham';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(window.location.href);
  }, [location.pathname, location.search]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <RouteTracker />
              <LoginModal />
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* Home */}
                  <Route index element={<Home />} />

                  {/* Collections & Products */}
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetails />} />
                  <Route path="collections" element={<Collection isDirectory={true} />} />
                  <Route path="collections/all" element={<Collection />} />
                  <Route path="collections/:slug" element={<Collection />} />

                  {/* Search, Cart, Wishlist, Checkout */}
                  <Route path="search" element={<SearchResults />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="checkout/success" element={<CheckoutSuccess />} />
                  <Route path="checkout-success" element={<CheckoutSuccess />} />
                  <Route path="checkout/callback/:provider" element={<PaymentCallback />} />

                  {/* Customer Account & Orders */}
                  <Route path="account" element={<Account />} />
                  <Route path="orders" element={<Navigate to="/account" replace />} />
                  <Route path="profile" element={<Navigate to="/account" replace />} />

                  {/* Blogs */}
                  <Route path="blogs" element={<Blog />} />
                  <Route path="blogs/:handle" element={<Blog />} />
                  <Route path="blogs/:handle/:postSlug" element={<BlogPost />} />
                  <Route path="blog" element={<Navigate to="/blogs" replace />} />
                  <Route path="blog/:postSlug" element={<BlogPost />} />
                  <Route path="pages/blogs" element={<Blog />} />
                  <Route path="pages/blogs/:postSlug" element={<BlogPost />} />

                  {/* Friendly page shortcuts */}
                  <Route path="about" element={<Navigate to="/pages/about" replace />} />
                  <Route path="about-us" element={<Navigate to="/pages/about" replace />} />
                  <Route path="contact" element={<Navigate to="/pages/contact" replace />} />
                  <Route path="contact-us" element={<Navigate to="/pages/contact" replace />} />
                  <Route path="faq" element={<Navigate to="/pages/faq" replace />} />
                  <Route path="our-cows" element={<Navigate to="/pages/our-cows" replace />} />
                  <Route path="our-farms" element={<Navigate to="/pages/our-farms" replace />} />

                  {/* Informational Pages */}
                  <Route path="pages/about" element={<About />} />
                  <Route path="pages/about-us" element={<About />} />
                  <Route path="pages/our-cows" element={<OurGauDham />} />
                  <Route path="pages/our-farms" element={<OurGauDham />} />
                  <Route path="pages/contact" element={<Contact />} />
                  <Route path="pages/faq" element={<FAQ />} />
                  <Route path="pages/return-policy" element={<FAQ />} />
                  <Route path="pages/privacy-policy" element={<FAQ />} />
                  <Route path="pages/terms-conditions" element={<FAQ />} />
                  <Route path="pages/shippingpolicy" element={<FAQ />} />

                  {/* 404 Catch-All */}
                  <Route path="404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
