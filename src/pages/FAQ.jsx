import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqs } from '../data/faq';
import { siteConfig } from '../data/siteConfig';
import WhatsAppIcon from '../components/WhatsAppIcon';

export default function FAQ() {
  const [openId, setOpenId] = useState(1);
  const [search, setSearch] = useState('');

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = search.trim()
    ? faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <div className="py-12 bg-stone-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-maroon flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-maroon bg-brand-maroon-subtle px-3 py-1 rounded-full">
            Devotee Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 mt-2">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-xl mx-auto">
            Find answers to commonly asked questions about Bhagvat Prasadam, our sacred preparation, payment options, and delivery.
          </p>

          {/* Quick FAQ Search */}
          <div className="mt-6 max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions (e.g. COD, Purity, Gifting)..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-brand-maroon shadow-sm"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-stone-900 flex items-center justify-between gap-4 hover:text-brand-maroon transition-colors"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-maroon flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 bg-stone-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm text-center">
          <h3 className="text-lg font-bold text-stone-900 mb-2">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-5 max-w-md mx-auto">
            We are always here to serve you. Reach out to our customer care team on WhatsApp or phone call.
          </p>
          <a
            href={siteConfig.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors shadow"
          >
            <WhatsAppIcon variant="monochrome" className="w-4 h-4 text-white" />
            <span>Chat on WhatsApp ({siteConfig.whatsappPhone})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
