import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';
import { media } from '../data/media';
import { siteConfig } from '../data/siteConfig';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import SafeImage from './SafeImage';
import WhatsAppIcon from './WhatsAppIcon';

export default function Footer() {
  const { openCart, cartCount } = useCart();
  const { t, language } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Accordion state for small screens (default collapsed for sleek mobile UI)
  const [openSections, setOpenSections] = useState({
    categories: false,
    quickLinks: false,
    policies: false,
    help: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#FCE6A9] text-[#332219] font-montserrat text-sm border-t border-[#F0D58C]">
        {/* Main Columns Container */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 pt-12 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
            
            {/* Column 1: Logo Box (Centered on small screens) */}
            <div className="lg:col-span-3 flex justify-center sm:justify-start">
              <Link to="/" className="inline-block">
                <div className="bg-white rounded-xl border-2 border-brand-maroon/70 p-3 sm:p-4 shadow-sm w-44 sm:w-52 aspect-[16/9] flex items-center justify-center hover:shadow-md transition-shadow">
                  <img
                    src={media.logo}
                    alt="Bhagvat Prasadam"
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Column 2: Categories / Menu (Dropdown on small screens) */}
            <div className="lg:col-span-2 border-b border-[#ebd288] md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('categories')}
                className="w-full flex items-center justify-between text-left font-semibold text-stone-900 text-base md:mb-3.5 tracking-tight md:cursor-default"
                aria-expanded={openSections.categories}
              >
                <span>{t('footer_categories', 'Categories')}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-700 transition-transform duration-200 md:hidden ${
                    openSections.categories ? 'rotate-180 text-brand-maroon' : ''
                  }`}
                />
              </button>
              <ul className={`${openSections.categories ? 'block pt-2.5' : 'hidden'} md:block space-y-2 text-xs sm:text-[13px] text-stone-700 font-medium animate-fade-in`}>
                <li>
                  <Link to="/collections/sweets" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('nav_sweets', 'Sweets')}
                  </Link>
                </li>
                <li>
                  <Link to="/collections/namkeen" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('nav_namkeen', 'Namkeen')}
                  </Link>
                </li>
                <li>
                  <Link to="/collections/natural" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('nav_natural', 'Natural')}
                  </Link>
                </li>
                <li>
                  <Link to="/collections/farali" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('sub_farali', 'Farali')}
                  </Link>
                </li>
                <li>
                  <Link to="/collections/ayurvedic" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('sub_ayurvedic', 'Ayurvedic')}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/our-cows" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('sub_our_cows', 'Our Cows')}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/our-farms" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {t('nav_gau_dham', 'Our Gau Dham')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links (Dropdown on small screens) */}
            <div className="lg:col-span-2 border-b border-[#ebd288] md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('quickLinks')}
                className="w-full flex items-center justify-between text-left font-semibold text-stone-900 text-base md:mb-3.5 tracking-tight md:cursor-default"
                aria-expanded={openSections.quickLinks}
              >
                <span>{t('footer_quick_links', 'Quick Links')}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-700 transition-transform duration-200 md:hidden ${
                    openSections.quickLinks ? 'rotate-180 text-brand-maroon' : ''
                  }`}
                />
              </button>
              <ul className={`${openSections.quickLinks ? 'block pt-2.5' : 'hidden'} md:block space-y-2 text-xs sm:text-[13px] text-stone-700 font-medium animate-fade-in`}>
                <li>
                  <Link to="/pages/about" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'અમારા વિશે' : language === 'hi' ? 'हमारे बारे में' : 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/contact" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'સંપર્ક કરો' : language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/about" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'દૈનિક દર્શન' : language === 'hi' ? 'दैनिक दर्शन' : 'Daily Darshan'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/contact" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'મોટો ઓર્ડર (બલ્ક ઓર્ડર)' : language === 'hi' ? 'थोक आर्डर' : 'Bulk Order'}
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'બ્લોગ્સ' : language === 'hi' ? 'ब्लॉग' : 'Blogs'}
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'ઓર્ડર ટ્રેક કરો' : language === 'hi' ? 'आर्डर ट्रैक करें' : 'Track Order'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/faq" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'સામાન્ય પ્રશ્નો (FAQ)' : language === 'hi' ? 'पूछे जाने वाले प्रश्न (FAQ)' : 'FAQ'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Policies (Dropdown on small screens) */}
            <div className="lg:col-span-2 border-b border-[#ebd288] md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('policies')}
                className="w-full flex items-center justify-between text-left font-semibold text-stone-900 text-base md:mb-3.5 tracking-tight md:cursor-default"
                aria-expanded={openSections.policies}
              >
                <span>{t('footer_policies', 'Policies')}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-700 transition-transform duration-200 md:hidden ${
                    openSections.policies ? 'rotate-180 text-brand-maroon' : ''
                  }`}
                />
              </button>
              <ul className={`${openSections.policies ? 'block pt-2.5' : 'hidden'} md:block space-y-2 text-xs sm:text-[13px] text-stone-700 font-medium animate-fade-in`}>
                <li>
                  <Link to="/pages/return-policy" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'રિટર્ન અને રિફંડ નીતિ' : language === 'hi' ? 'वापसी व धनवापसी नीति' : 'Return & Refund'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/privacy-policy" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'ગોપનીયતા નીતિ' : language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/terms-conditions" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'નિયમો અને શરતો' : language === 'hi' ? 'नियम व शर्तें' : 'Terms and Conditions'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/shippingpolicy" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'શિપિંગ નીતિ' : language === 'hi' ? 'शिपिंग नीति' : 'Shipping Policy'}
                  </Link>
                </li>
                <li>
                  <Link to="/pages/about" className="hover:text-brand-maroon transition-colors block py-0.5">
                    {language === 'gu' ? 'ગુણવત્તા નીતિ' : language === 'hi' ? 'गुणवत्ता नीति' : 'Quality Policy'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Need Help?? (Dropdown on small screens) */}
            <div className="lg:col-span-3 border-b border-[#ebd288] md:border-b-0 pb-3 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('help')}
                className="w-full flex items-center justify-between text-left font-semibold text-stone-900 text-base md:mb-3.5 tracking-tight md:cursor-default"
                aria-expanded={openSections.help}
              >
                <span>
                  {t('footer_help', 'Need Help??')} <span className="text-xs text-stone-600 font-normal">(10:00am - 6:00pm)</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-700 transition-transform duration-200 md:hidden flex-shrink-0 ${
                    openSections.help ? 'rotate-180 text-brand-maroon' : ''
                  }`}
                />
              </button>

              <div className={`${openSections.help ? 'block pt-2.5' : 'hidden'} md:block space-y-2.5 text-xs sm:text-[13px] text-stone-700 animate-fade-in`}>
                <div>
                  <p className="font-medium text-stone-800">Sales Support</p>
                  <a href="tel:+919726778118" className="hover:text-brand-maroon transition-colors font-medium">
                    +91 9726778118 (Mon-Sat)
                  </a>
                </div>

                <div>
                  <p className="font-medium text-stone-800">After Sales Support</p>
                  <a href="tel:+919310501040" className="hover:text-brand-maroon transition-colors font-medium">
                    +91 9310501040 (Mon-Sat)
                  </a>
                </div>

                <div>
                  <p className="font-medium text-stone-800">Complain &amp; Grievance</p>
                  <a href="tel:+919824878118" className="hover:text-brand-maroon transition-colors font-medium">
                    +91 9824878118 (Mon-Sat)
                  </a>
                </div>

                <div className="pt-2">
                  <p className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
                    GET IN TOUCH
                  </p>
                  <a href="mailto:bprasadam@sgrs.org" className="hover:text-brand-maroon transition-colors block font-medium">
                    bprasadam@sgrs.org
                  </a>
                  <p className="text-stone-700 mt-0.5">
                    At NilkanthDham: Poicha, Gujarat (IN)
                  </p>
                </div>
              </div>

              {/* Social Icons with circular outline */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-800 hover:bg-stone-900 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-800 hover:bg-stone-900 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={siteConfig.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-800 hover:bg-stone-900 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-800 hover:bg-stone-900 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon variant="monochrome" className="w-3.5 h-3.5" />
                </a>
                <a
                  href={siteConfig.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-stone-800 hover:bg-stone-900 hover:text-white transition-colors"
                  aria-label="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* App Discount Strip */}
        <div className="bg-[#F5D890] border-t border-[#EBCC80] py-3 px-3 sm:px-6">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-800">
            <span>
              Install Bhagvat Prasadam App &amp; Get <strong className="text-brand-maroon font-extrabold">2% Extra Discount</strong> on App! Available on:
            </span>
            <div className="flex items-center gap-2">
              <a
                href={siteConfig.appLinks.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-stone-800 text-white px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.5 1.5 0 0 1-.61-.318V2.132a1.5 1.5 0 0 1 .609-.318zm11.242 11.245l2.428-2.428-11.75-6.784 9.322 9.212zm0 1.882L5.529 24.153l11.75-6.784-2.428-2.428zm3.567-2.022l3.076-1.776a1.2 1.2 0 0 0 0-2.086l-3.076-1.776-2.127 2.819 2.127 2.819z"/>
                </svg>
                <span className="font-bold text-[11px]">Play Store</span>
              </a>
              <a
                href={siteConfig.appLinks.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-stone-800 text-white px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.14.65-2.82 1.46-.59.69-1.12 1.83-.98 2.94 1.08.08 2.16-.54 2.81-1.3"/>
                </svg>
                <span className="font-bold text-[11px]">App Store</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Dark Maroon Copyright Bar */}
        <div className="bg-[#52060A] text-stone-300 py-3 px-3 sm:px-6 text-xs font-medium text-center sm:text-left">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-stone-300/90 text-xs">
              © {new Date().getFullYear()} Bhagvat Prasadam, Trade Name Storeview. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Vertical Right Edge Controls (Matching bhagvatprasadam.com .floating-actions) */}
      <div className="fixed right-0 bottom-8 z-50 flex flex-col gap-1.5 items-end pointer-events-none">
        {/* Back To Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-[#700B10] hover:bg-[#55080c] text-white rounded-l-lg rounded-r-none shadow-md flex items-center justify-center pointer-events-auto transition-transform hover:-translate-x-0.5"
          >
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>
        )}

        {/* WhatsApp Button */}
        <a
          href={siteConfig.socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Us"
          className="w-9 h-9 sm:w-10 sm:h-10 bg-[#700B10] hover:bg-[#55080c] text-white rounded-l-lg rounded-r-none shadow-md flex items-center justify-center pointer-events-auto transition-transform hover:-translate-x-0.5"
        >
          <WhatsAppIcon variant="monochrome" className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" />
        </a>

        {/* Cart Drawer Trigger Button */}
        <button
          type="button"
          onClick={openCart}
          aria-label="Cart"
          className="w-9 h-9 sm:w-10 sm:h-10 bg-[#700B10] hover:bg-[#55080c] text-white rounded-l-lg rounded-r-none shadow-md flex items-center justify-center pointer-events-auto transition-transform hover:-translate-x-0.5 relative"
        >
          <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white stroke-[2.2]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -left-1 bg-[#ff3b30] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
