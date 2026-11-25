import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { submitEnquiry } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const storedCustomer = localStorage.getItem('customer_data');
      if (storedCustomer) {
        const parsed = JSON.parse(storedCustomer);
        setFormData(prev => ({
          ...prev,
          firstName: prev.firstName || parsed.firstName || parsed.first_name || '',
          lastName: prev.lastName || parsed.lastName || parsed.last_name || '',
          email: prev.email || parsed.email || '',
          mobile: prev.mobile || parsed.phone || parsed.mobile || '',
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'Please enter your first name';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    const cleanMobile = formData.mobile.replace(/[^0-9]/g, '');
    if (!formData.mobile.trim()) {
      errs.mobile = 'Please enter your mobile number';
    } else if (cleanMobile.length < 10) {
      errs.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.message.trim()) errs.message = 'Please enter your inquiry or feedback';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const cleanMobile = formData.mobile.replace(/[^0-9]/g, '').slice(-10) || formData.mobile.trim();
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        mobile: cleanMobile,
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      const res = await submitEnquiry(payload);
      if (res && res.success) {
        setIsSubmitted(true);
        setSuccessMessage(res.message || 'Your enquiry has been received successfully. We will get back to you shortly.');
      } else {
        setServerError(res?.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-stone-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-maroon bg-brand-maroon-subtle px-3 py-1 rounded-full">
            Temple Customer Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">
            Get In Touch With Us
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Have questions about orders, bulk prasad delivery, or temple offerings? Our seva team is happy to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
                Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-maroon flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Sales & Order Support</h4>
                    <a href={`tel:${siteConfig.phone}`} className="text-brand-maroon font-extrabold hover:underline">
                      {siteConfig.phone}
                    </a>
                    <p className="text-[11px] text-stone-400 mt-0.5">{siteConfig.supportHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0">
                    <WhatsAppIcon variant="monochrome" className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">WhatsApp Support</h4>
                    <a
                      href={siteConfig.socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      {siteConfig.whatsappPhone}
                    </a>
                    <p className="text-[11px] text-stone-400 mt-0.5">Quick order updates & bulk queries</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-maroon flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Email Address</h4>
                    <a href={`mailto:${siteConfig.email}`} className="text-stone-700 hover:text-brand-maroon">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-maroon flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">Temple Address</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {siteConfig.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-black text-stone-900">Jai Swaminarayan!</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  {successMessage || "Thank you for reaching out to Bhagvat Prasadam. Your message has been received by our seva team. We will respond promptly within 24 business hours."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setSuccessMessage('');
                    setFormData({ firstName: '', lastName: '', email: '', mobile: '', message: '' });
                  }}
                  className="bg-brand-maroon hover:bg-brand-maroon-dark text-white font-bold text-xs px-6 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 mb-2">Send Us a Message</h3>

                {serverError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {serverError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-brand-maroon"
                      placeholder="e.g. Raj"
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-brand-maroon"
                      placeholder="e.g. Patel"
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-brand-maroon"
                      placeholder="raj.patel@gmail.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-brand-maroon"
                      placeholder="9876543210"
                    />
                    {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Message / Inquiry *
                  </label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-brand-maroon"
                    placeholder="I would like to enquire about bulk order discounts for Kaju Katli..."
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-maroon hover:bg-brand-maroon-dark disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl shadow transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
